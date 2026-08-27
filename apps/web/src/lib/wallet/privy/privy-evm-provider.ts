import type { EIP1193EventMap, EIP1193Provider } from 'viem'

type ProviderListeners = {
  [Event in keyof EIP1193EventMap]: Set<EIP1193EventMap[Event]>
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
 * Privy's `wallet.switchChain()` invalidates existing provider instances. Keep
 * one EIP-1193 identity for Wagmi while replacing the provider underneath it.
 */
export function createPrivyEvmProvider({
  provider: initialProvider,
  switchChain,
}: {
  provider: EIP1193Provider
  switchChain(chainId: number): Promise<EIP1193Provider>
}): EIP1193Provider {
  let provider = initialProvider
  const listeners: ProviderListeners = {
    accountsChanged: new Set(),
    chainChanged: new Set(),
    connect: new Set(),
    disconnect: new Set(),
    message: new Set(),
  }

  function attachListeners(target: EIP1193Provider): void {
    for (const listener of listeners.accountsChanged) {
      target.on('accountsChanged', listener)
    }
    for (const listener of listeners.chainChanged) {
      target.on('chainChanged', listener)
    }
    for (const listener of listeners.connect) target.on('connect', listener)
    for (const listener of listeners.disconnect) {
      target.on('disconnect', listener)
    }
    for (const listener of listeners.message) target.on('message', listener)
  }

  function detachListeners(target: EIP1193Provider): void {
    for (const listener of listeners.accountsChanged) {
      target.removeListener('accountsChanged', listener)
    }
    for (const listener of listeners.chainChanged) {
      target.removeListener('chainChanged', listener)
    }
    for (const listener of listeners.connect) {
      target.removeListener('connect', listener)
    }
    for (const listener of listeners.disconnect) {
      target.removeListener('disconnect', listener)
    }
    for (const listener of listeners.message) {
      target.removeListener('message', listener)
    }
  }

  function setProvider(nextProvider: EIP1193Provider): void {
    if (nextProvider === provider) return
    detachListeners(provider)
    provider = nextProvider
    attachListeners(provider)
  }

  function addListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (listeners[event].has(listener)) return
    listeners[event].add(listener)
    provider.on(event, listener)
  }

  function removeListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (!listeners[event].delete(listener)) return
    provider.removeListener(event, listener)
  }

  const request: EIP1193Provider['request'] = async (parameters) => {
    if (parameters.method === 'wallet_switchEthereumChain') {
      const chainId = getRequestedChainId(parameters)
      setProvider(await switchChain(chainId))
      return null as never
    }
    return (await provider.request(parameters as never)) as never
  }

  return {
    on: addListener,
    removeListener,
    request,
  }
}
