import type { EIP1193EventMap, EIP1193Provider } from 'viem'

type ProviderListeners = {
  [Event in keyof EIP1193EventMap]: Set<EIP1193EventMap[Event]>
}

export interface DeferredPrivyEvmProvider extends EIP1193Provider {
  clearTarget(): void
  getTarget(): EIP1193Provider | undefined
  setTarget(provider: EIP1193Provider): void
}

export class PrivyProviderDisconnectedError extends Error {
  readonly code = 4900
  override readonly name = 'PrivyProviderDisconnectedError'

  constructor() {
    super('Privy EVM provider is disconnected')
  }
}

function getRequestedChainId(parameters: { params?: unknown }): number {
  const parameter = Array.isArray(parameters.params)
    ? parameters.params[0]
    : undefined
  const chainId =
    parameter &&
    typeof parameter === 'object' &&
    'chainId' in parameter &&
    typeof parameter.chainId === 'string'
      ? Number(parameter.chainId)
      : Number.NaN

  if (!Number.isSafeInteger(chainId) || chainId <= 0) {
    throw new Error('Privy received an invalid chain ID')
  }
  return chainId
}

/**
 * Keeps one EIP-1193 identity for Wagmi while the lazily mounted Privy runtime
 * supplies and replaces the provider behind it.
 *
 * Requests are never queued while disconnected. Replaying a stale request
 * after a later login could otherwise send it through a different user's
 * wallet.
 */
export function createDeferredPrivyEvmProvider({
  switchChain,
}: {
  switchChain(chainId: number): Promise<void>
}): DeferredPrivyEvmProvider {
  let target: EIP1193Provider | undefined
  const listeners: ProviderListeners = {
    accountsChanged: new Set(),
    chainChanged: new Set(),
    connect: new Set(),
    disconnect: new Set(),
    message: new Set(),
  }

  function attachListeners(provider: EIP1193Provider): void {
    for (const event of Object.keys(listeners) as (keyof ProviderListeners)[]) {
      for (const listener of listeners[event]) provider.on(event, listener)
    }
  }

  function detachListeners(provider: EIP1193Provider): void {
    for (const event of Object.keys(listeners) as (keyof ProviderListeners)[]) {
      for (const listener of listeners[event]) {
        provider.removeListener(event, listener)
      }
    }
  }

  function setTarget(provider: EIP1193Provider): void {
    if (provider === target) return
    if (target) detachListeners(target)
    target = provider
    attachListeners(provider)
  }

  function clearTarget(): void {
    if (!target) return
    detachListeners(target)
    target = undefined
  }

  function addListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (listeners[event].has(listener)) return
    listeners[event].add(listener)
    target?.on(event, listener)
  }

  function removeListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (!listeners[event].delete(listener)) return
    target?.removeListener(event, listener)
  }

  const request: EIP1193Provider['request'] = async (parameters) => {
    if (parameters.method === 'wallet_switchEthereumChain') {
      await switchChain(getRequestedChainId(parameters))
      return null as never
    }

    const provider = target
    if (!provider) throw new PrivyProviderDisconnectedError()
    return (await provider.request(parameters as never)) as never
  }

  return {
    clearTarget,
    getTarget: () => target,
    on: addListener,
    removeListener,
    request,
    setTarget,
  }
}
