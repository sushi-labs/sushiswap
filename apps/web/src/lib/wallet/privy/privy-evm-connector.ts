import { injected } from '@wagmi/connectors'
import { ProviderNotFoundError } from '@wagmi/core'
import type { EIP1193EventMap, EIP1193Provider } from 'viem'
import {
  type PrivyRuntimeStore,
  privyRuntimeStore,
} from './privy-runtime-store'
import type { PrivyEvmWallet, PrivyRuntimeSnapshot } from './types'

export const PRIVY_EVM_CONNECTOR_ID = 'io.privy'
export const PRIVY_EVM_CONNECTOR_NAME = 'Email'

type ProviderListeners = {
  [Event in keyof EIP1193EventMap]: Set<EIP1193EventMap[Event]>
}

type ProviderResolution = {
  id: number
  promise: Promise<EIP1193Provider>
  wallet: PrivyEvmWallet
}

function getSnapshotWallet(
  snapshot: PrivyRuntimeSnapshot,
): PrivyEvmWallet | undefined {
  if (snapshot.status !== 'ready' || !snapshot.authenticated) return undefined
  return snapshot.evmWallet ?? undefined
}

function getWallet(store: PrivyRuntimeStore): PrivyEvmWallet | undefined {
  return getSnapshotWallet(store.getSnapshot())
}

function createPrivyEvmProvider(store: PrivyRuntimeStore): EIP1193Provider {
  let boundProvider: EIP1193Provider | undefined
  let boundProviderResolutionId = 0
  let boundWallet: PrivyEvmWallet | undefined
  let activeProviderResolution: ProviderResolution | undefined
  let providerResolutionId = 0
  const listeners: ProviderListeners = {
    accountsChanged: new Set(),
    chainChanged: new Set(),
    connect: new Set(),
    disconnect: new Set(),
    message: new Set(),
  }

  function attachListeners(provider: EIP1193Provider): void {
    for (const listener of listeners.accountsChanged) {
      provider.on('accountsChanged', listener)
    }
    for (const listener of listeners.chainChanged) {
      provider.on('chainChanged', listener)
    }
    for (const listener of listeners.connect) provider.on('connect', listener)
    for (const listener of listeners.disconnect) {
      provider.on('disconnect', listener)
    }
    for (const listener of listeners.message) provider.on('message', listener)
  }

  function detachListeners(provider: EIP1193Provider): void {
    for (const listener of listeners.accountsChanged) {
      provider.removeListener('accountsChanged', listener)
    }
    for (const listener of listeners.chainChanged) {
      provider.removeListener('chainChanged', listener)
    }
    for (const listener of listeners.connect) {
      provider.removeListener('connect', listener)
    }
    for (const listener of listeners.disconnect) {
      provider.removeListener('disconnect', listener)
    }
    for (const listener of listeners.message) {
      provider.removeListener('message', listener)
    }
  }

  function setProvider(
    provider: EIP1193Provider | undefined,
    wallet?: PrivyEvmWallet,
    resolutionId = 0,
  ): void {
    if (provider === boundProvider) {
      boundProviderResolutionId = provider ? resolutionId : 0
      boundWallet = provider ? wallet : undefined
      return
    }
    if (boundProvider) detachListeners(boundProvider)
    boundProvider = provider
    boundProviderResolutionId = provider ? resolutionId : 0
    boundWallet = provider ? wallet : undefined
    if (boundProvider) attachListeners(boundProvider)
  }

  function emitAccountsRemoved(): void {
    for (const listener of listeners.accountsChanged) listener([])
  }

  function invalidateProviderResolution(): void {
    providerResolutionId += 1
    activeProviderResolution = undefined
  }

  function startProviderResolution(wallet: PrivyEvmWallet): ProviderResolution {
    const id = ++providerResolutionId
    const promise = (async (): Promise<EIP1193Provider> => {
      const provider = await wallet.getProvider()
      if (id !== providerResolutionId || getWallet(store) !== wallet) {
        throw new ProviderNotFoundError()
      }
      setProvider(provider, wallet, id)
      return provider
    })()
    const resolution = { id, promise, wallet }
    activeProviderResolution = resolution
    function clearActiveResolution(): void {
      if (activeProviderResolution?.id === id) {
        activeProviderResolution = undefined
      }
    }
    void promise.then(clearActiveResolution, clearActiveResolution)
    return resolution
  }

  function resolveProvider(forceRefresh = false): Promise<EIP1193Provider> {
    const wallet = getWallet(store)
    if (!wallet) return Promise.reject(new ProviderNotFoundError())

    if (!forceRefresh) {
      if (activeProviderResolution?.wallet === wallet) {
        return activeProviderResolution.promise
      }
      if (
        boundProvider &&
        boundWallet === wallet &&
        boundProviderResolutionId === providerResolutionId
      ) {
        return Promise.resolve(boundProvider)
      }
    }
    return startProviderResolution(wallet).promise
  }

  async function syncWallet(wallet: PrivyEvmWallet): Promise<void> {
    const resolution = startProviderResolution(wallet)
    try {
      await resolution.promise
    } catch {
      if (
        getWallet(store) !== wallet ||
        boundProviderResolutionId > resolution.id
      ) {
        return
      }
      const hadProvider = Boolean(boundProvider)
      setProvider(undefined)
      if (hadProvider) emitAccountsRemoved()
    }
  }

  store.subscribe((snapshot, previousSnapshot) => {
    const wallet = getSnapshotWallet(snapshot)
    const previousWallet = getSnapshotWallet(previousSnapshot)
    if (wallet === previousWallet) return

    if (!wallet) {
      invalidateProviderResolution()
      const hadProvider = Boolean(boundProvider)
      setProvider(undefined)
      if (hadProvider) emitAccountsRemoved()
      return
    }

    if (
      previousWallet &&
      previousWallet.address.toLowerCase() !== wallet.address.toLowerCase()
    ) {
      invalidateProviderResolution()
      const hadProvider = Boolean(boundProvider)
      setProvider(undefined)
      if (hadProvider) emitAccountsRemoved()
    }

    void syncWallet(wallet)
  })

  function addListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (listeners[event].has(listener)) return
    listeners[event].add(listener)
    boundProvider?.on(event, listener)
  }

  function removeListener<Event extends keyof EIP1193EventMap>(
    event: Event,
    listener: EIP1193EventMap[Event],
  ): void {
    if (!listeners[event].delete(listener)) return
    boundProvider?.removeListener(event, listener)
  }

  const request: EIP1193Provider['request'] = async (parameters) => {
    const provider = await resolveProvider()
    const result = await provider.request(parameters as never)
    if (
      parameters.method === 'wallet_switchEthereumChain' ||
      parameters.method === 'wallet_addEthereumChain'
    ) {
      // The RPC itself succeeded. Orphan the old binding, but let Wagmi's
      // follow-up chain read retry a transient Privy provider lookup failure.
      try {
        await resolveProvider(true)
      } catch {}
    }
    return result as never
  }

  return {
    request,
    on: addListener,
    removeListener,
  }
}

/**
 * A fixed Wagmi connector whose provider becomes available when the lazy
 * Privy runtime publishes an embedded EVM wallet.
 */
export function createPrivyEvmConnector(
  store: PrivyRuntimeStore = privyRuntimeStore,
) {
  return injected({
    target: {
      id: PRIVY_EVM_CONNECTOR_ID,
      name: PRIVY_EVM_CONNECTOR_NAME,
      provider: createPrivyEvmProvider(store),
    },
  })
}
