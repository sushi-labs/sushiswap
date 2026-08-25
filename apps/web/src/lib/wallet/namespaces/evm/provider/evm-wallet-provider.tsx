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
} from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { PRIVY_EVM_CONNECTOR_ID } from 'src/lib/wallet/privy/privy-evm-connector'
import {
  connectPrivyEvmWallet,
  logoutPrivyRuntime,
  usePrivyRuntime,
} from 'src/lib/wallet/privy/use-privy-runtime'
import { getWalletRestorationState } from 'src/lib/wallet/provider/get-wallet-restoration-state'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections as getWalletConnections,
  setWalletNamespaceRestoring,
} from 'src/lib/wallet/provider/store'
import { useInitialWalletAutoConnectPending } from 'src/lib/wallet/provider/use-initial-wallet-auto-connect-pending'
import type { Wallet } from 'src/lib/wallet/types'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import {
  WagmiContext,
  WagmiProvider,
  useConnection,
  useDisconnect,
} from 'wagmi'
import type { WalletNamespaceContext } from '../../types'
import { EvmAdapterConfig, EvmAdapterId } from '../config'
import { isEvmWallet } from '../types'

function useInEvmContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

const EvmWalletContext = createContext<WalletNamespaceContext | null>(null)

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
  const isAutoConnectPending = useInitialWalletAutoConnectPending({
    getHasReconnectCandidate: getHasInitialWagmiReconnectCandidate,
    isConnectionAttemptActive: isConnecting || isReconnecting || isConnected,
  })
  const { isPending } = useDisconnect()
  const privyRuntime = usePrivyRuntime()

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
      if (wallet.adapterId === EvmAdapterId.Privy) {
        const account = await connectPrivyEvmWallet(config)
        onSuccess?.(account)
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
    [connector?.id, address],
  )

  const disconnect = useCallback(async () => {
    const config = getWagmiConfig()
    const connections = getConnections(config)
    const disconnectsPrivy = connections.some(
      (connection) => connection.connector.id === PRIVY_EVM_CONNECTOR_ID,
    )
    for (const connection of connections) {
      await wagmiDisconnect(config, {
        connector: connection.connector,
      })
    }
    if (disconnectsPrivy) await logoutPrivyRuntime()
  }, [])

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

    const walletId = `evm:${connector.id.toLowerCase()}`
    addWalletConnection({
      chainId: isEvmChainId(chainId) ? chainId : EvmChainId.ETHEREUM,
      id: walletId,
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
        isProviderReady: privyRuntime.status !== 'loading',
        isAutoConnectPending,
        isConnecting: isConnecting || isReconnecting,
        isConnected,
      }),
    )
  }, [
    isConnected,
    isConnecting,
    isReconnecting,
    isAutoConnectPending,
    privyRuntime.status,
  ])

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}

async function getHasInitialWagmiReconnectCandidate(): Promise<boolean> {
  const config = getWagmiConfig()
  const persistedStore = await config.storage?.getItem('store')
  const recentConnectorId = await config.storage?.getItem('recentConnectorId')
  const wasExplicitlyDisconnected =
    typeof recentConnectorId === 'string' && recentConnectorId.length > 0
      ? await config.storage?.getItem(`${recentConnectorId}.disconnected`)
      : false

  return (
    hasCurrentConnection(persistedStore) ||
    (typeof recentConnectorId === 'string' &&
      recentConnectorId.length > 0 &&
      wasExplicitlyDisconnected !== true)
  )
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
