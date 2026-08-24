import {
  useConnectOrCreateWallet,
  usePrivy,
  useWallets as usePrivyWallets,
} from '@privy-io/react-auth'
import { WagmiProvider, useSetActiveWallet } from '@privy-io/wagmi'
import {
  getConnections,
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
} from '@wagmi/core'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet/hooks/use-privy-embedded'
import {
  getIsPrivyWalletProviderReady,
  getWalletRestorationState,
} from 'src/lib/wallet/provider/get-wallet-restoration-state'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections as getWalletConnections,
  setWalletNamespaceRestoring,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import { WagmiContext, useConnection, useDisconnect } from 'wagmi'
import type { WalletNamespaceContext } from '../../types'
import { EvmAdapterConfig, EvmAdapterId } from '../config'
import { isEvmWallet } from '../types'

function useInEvmContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

const EvmWalletContext = createContext<WalletNamespaceContext | null>(null)
const INITIAL_RECONNECT_TIMEOUT_MS = 5_000

export function useEvmWalletContext() {
  const ctx = useContext(EvmWalletContext)
  if (!ctx)
    throw new Error(
      'useEvmWalletContext must be used within <EvmWalletProvider>',
    )
  return ctx
}

export default function EvmWalletProvider({
  children,
}: { children: React.ReactNode }) {
  const inEvmContext = useInEvmContext()

  if (inEvmContext) {
    return <_EvmWalletProvider>{children}</_EvmWalletProvider>
  } else {
    return (
      <WagmiProvider config={getWagmiConfig()}>
        <_EvmWalletProvider>{children}</_EvmWalletProvider>
      </WagmiProvider>
    )
  }
}

function _EvmWalletProvider({ children }: { children: React.ReactNode }) {
  const {
    isConnected,
    address,
    connector,
    chainId,
    isConnecting,
    isReconnecting,
  } = useConnection()
  const isAutoConnectPending = useIsInitialWagmiAutoConnectPending({
    isConnecting,
    isReconnecting,
    isConnected,
  })
  const { isPending } = useDisconnect()
  const { setActiveWallet } = useSetActiveWallet()
  const { ready: arePrivyWalletsReady } = usePrivyWallets()
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('evm')
  const {
    authenticated: isPrivyAuthenticated,
    ready: isPrivyAuthReady,
    logout,
  } = usePrivy()

  const { connectOrCreateWallet } = useConnectOrCreateWallet({
    onSuccess: async (data) => {
      if (privyEmbeddedWallet?.address === data.wallet.address) {
        await setActiveWallet(privyEmbeddedWallet)
        return
      }
    },
  })

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!isEvmWallet(wallet)) {
        throw new Error(`Invalid namespace for ${wallet.name}`)
      }
      const config = getWagmiConfig()
      const connections = getConnections(config)
      for (const connection of connections) {
        if (connection.connector.uid !== wallet.uid) {
          await wagmiDisconnect(config, {
            connector: connection.connector,
          })
        }
      }
      if (wallet.adapterId === EvmAdapterId.Privy && privyEmbeddedWallet) {
        await setActiveWallet(privyEmbeddedWallet)
        onSuccess?.(privyEmbeddedWallet.address)
        return
      } else if (
        wallet.adapterId === EvmAdapterId.Privy &&
        !privyEmbeddedWallet
      ) {
        connectOrCreateWallet()
        return
      }

      if (
        connector?.id &&
        wallet.id === `evm:${connector.id.toLowerCase()}` &&
        address
      ) {
        onSuccess?.(address)
      } else {
        const { accounts } = await wagmiConnect(getWagmiConfig(), {
          connector: await EvmAdapterConfig[wallet.adapterId]({
            uid: wallet.uid,
          }),
        })

        onSuccess?.(accounts[0])
      }
    },
    [
      connector?.id,
      address,
      privyEmbeddedWallet,
      setActiveWallet,
      connectOrCreateWallet,
    ],
  )

  const disconnect = useCallback(async () => {
    const config = getWagmiConfig()
    const connections = getConnections(config)
    for (const connection of connections) {
      await wagmiDisconnect(config, {
        connector: connection.connector,
      })
    }
    if (privyEmbeddedWallet) {
      await logout()
    }
  }, [logout, privyEmbeddedWallet])

  const value = useMemo(
    () => ({
      isConnected: isConnected,
      account: address,
      connect,
      disconnect,
    }),
    [isConnected, address, connect, disconnect],
  )

  useEffect(() => {
    if (isConnecting || isReconnecting || isPending) return
    if (!isConnected || !connector?.id || !address || !chainId) {
      clearWalletConnections('evm')
      return
    }

    addWalletConnection({
      chainId: isEvmChainId(chainId) ? chainId : EvmChainId.ETHEREUM,
      id: `evm:${connector.id.toLowerCase()}`,
      name: connector.name,
      namespace: 'evm',
      account: address,
      icon: connector?.icon,
    })
  }, [
    isConnected,
    connector?.id,
    connector?.name,
    connector?.icon,
    address,
    chainId,
    isConnecting,
    isReconnecting,
    isPending,
  ])

  useEffect(() => {
    const hasRegisteredConnection = getWalletConnections().some(
      (connection) => connection.namespace === 'evm',
    )

    setWalletNamespaceRestoring(
      'evm',
      getWalletRestorationState({
        hasRegisteredConnection,
        isProviderReady: getIsPrivyWalletProviderReady({
          isAuthReady: isPrivyAuthReady,
          isAuthenticated: isPrivyAuthenticated,
          areWalletsReady: arePrivyWalletsReady,
        }),
        isAutoConnectPending,
        isConnecting: isConnecting || isReconnecting,
        isConnected,
      }),
    )
  }, [
    arePrivyWalletsReady,
    isConnected,
    isConnecting,
    isPrivyAuthenticated,
    isPrivyAuthReady,
    isReconnecting,
    isAutoConnectPending,
  ])

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}

function useIsInitialWagmiAutoConnectPending({
  isConnecting,
  isReconnecting,
  isConnected,
}: {
  isConnecting: boolean
  isReconnecting: boolean
  isConnected: boolean
}): boolean {
  // Privy registers persisted injected connectors before it asks Wagmi to
  // reconnect them. Bridge that gap so connect controls cannot open early.
  const [isPending, setIsPending] = useState(true)
  const isConnectionAttemptActive =
    isConnecting || isReconnecting || isConnected

  useEffect(() => {
    if (!isPending) return

    if (isConnectionAttemptActive) {
      setIsPending(false)
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined

    async function checkPersistedConnection(): Promise<void> {
      let hasReconnectCandidate = false

      try {
        const config = getWagmiConfig()
        const persistedStore = await config.storage?.getItem('store')
        const recentConnectorId =
          await config.storage?.getItem('recentConnectorId')
        const wasExplicitlyDisconnected =
          typeof recentConnectorId === 'string' && recentConnectorId.length > 0
            ? await config.storage?.getItem(`${recentConnectorId}.disconnected`)
            : false

        hasReconnectCandidate =
          hasCurrentConnection(persistedStore) ||
          (typeof recentConnectorId === 'string' &&
            recentConnectorId.length > 0 &&
            wasExplicitlyDisconnected !== true)
      } catch {}

      if (cancelled) return

      if (!hasReconnectCandidate) {
        setIsPending(false)
        return
      }

      timeout = setTimeout(() => {
        setIsPending(false)
      }, INITIAL_RECONNECT_TIMEOUT_MS)
    }

    void checkPersistedConnection()

    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [isConnectionAttemptActive, isPending])

  return isPending
}

function hasCurrentConnection(persistedStore: unknown): boolean {
  if (
    !persistedStore ||
    typeof persistedStore !== 'object' ||
    !('state' in persistedStore)
  ) {
    return false
  }

  const { state } = persistedStore
  return Boolean(
    state && typeof state === 'object' && 'current' in state && state.current,
  )
}
