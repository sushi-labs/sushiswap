import {
  type Config,
  type Connection,
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
import { hasPersistedConnections } from 'src/lib/wagmi/config/persisted-connectors'
import {
  hasPrivyEvmReconnectIntent,
  isPrivyEvmConnector,
} from 'src/lib/wallet/privy/privy-evm-connector'
import { hasPrivyWalletConnectionOutside } from 'src/lib/wallet/privy/privy-session'
import { logoutPrivyRuntime } from 'src/lib/wallet/privy/use-privy-runtime'
import { getWalletRestorationState } from 'src/lib/wallet/provider/get-wallet-restoration-state'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections as getWalletConnections,
  setWalletNamespaceRestoring,
} from 'src/lib/wallet/provider/store'
import { useInitialWalletAutoConnectPending } from 'src/lib/wallet/provider/use-initial-wallet-auto-connect-pending'
import type { Wallet } from 'src/lib/wallet/types'
import { PrivyRuntimeGate } from 'src/providers/privy-runtime-gate'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import {
  WagmiContext,
  WagmiProvider,
  useConnection,
  useDisconnect,
} from 'wagmi'
import type { WalletNamespaceContext } from '../../types'
import { EvmAdapterConfig } from '../config'
import { isEvmWallet } from '../types'
import {
  findEvmWalletConnector,
  getConnectedEvmAccount,
  getEvmConnections,
  toEvmWalletId,
} from './connect-plan'

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
        <PrivyRuntimeGate />
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

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!isEvmWallet(wallet)) {
        throw new Error(`Invalid namespace for ${wallet.name}`)
      }
      const config = getWagmiConfig()
      // Identity comes from the connector registry: a statically defined
      // wallet entry has no `uid`, and a connection still being restored
      // carries the previous page load's `uid`. Leaving either in place would
      // strand it in Wagmi's connection map, where a later disconnect would
      // promote it to the active connection.
      const target = findEvmWalletConnector(config, wallet)
      for (const connection of getEvmConnections(config)) {
        if (connection.connector.uid !== target?.uid) {
          await disconnectConnection(config, connection)
        }
      }

      const connectedAccount = getConnectedEvmAccount(config, target)
      if (connectedAccount) {
        onSuccess?.(connectedAccount)
      } else {
        const { accounts } = await wagmiConnect(config, {
          connector: await EvmAdapterConfig[wallet.adapterId]({
            uid: wallet.uid,
          }),
        })

        onSuccess?.(accounts[0])
      }
    },
    [],
  )

  const disconnect = useCallback(async () => {
    const config = getWagmiConfig()
    const connections = getEvmConnections(config)
    const disconnectsPrivy = connections.some((connection) =>
      isPrivyEvmConnector(connection.connector),
    )
    for (const connection of connections) {
      await disconnectConnection(config, connection)
    }
    // Privy is one session shared with the other namespaces; only the last
    // wallet using it may log out.
    if (disconnectsPrivy && !hasPrivyWalletConnectionOutside('evm')) {
      await logoutPrivyRuntime()
    }
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

    addWalletConnection({
      chainId: isEvmChainId(chainId) ? chainId : EvmChainId.ETHEREUM,
      id: toEvmWalletId(connector.id),
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
        isProviderReady: true,
        isAutoConnectPending,
        isConnecting: isConnecting || isReconnecting,
        isConnected,
      }),
    )
  }, [isConnected, isConnecting, isReconnecting, isAutoConnectPending])

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}

/**
 * While Wagmi is still reconnecting, hydrated connections only carry the
 * serialized connector stub (`{ id, name, type, uid }`), which has no
 * `disconnect()`. Resolve the live connector first and, failing that, drop the
 * connection from state directly so the user's disconnect still takes effect.
 */
async function disconnectConnection(
  config: Config,
  connection: Connection,
): Promise<void> {
  const stub = connection.connector
  if (typeof stub.disconnect === 'function') {
    await wagmiDisconnect(config, { connector: stub })
    return
  }
  const connector = config.connectors.find(
    (candidate) => candidate.id === stub.id,
  )
  // Let the live connector record the disconnect (shim, cancelled restore)
  // even though Wagmi keys the stale entry by the previous session's uid.
  if (connector) await wagmiDisconnect(config, { connector })
  config.setState((state) => {
    if (!state.connections.has(stub.uid)) return state
    const connections = new Map(state.connections)
    connections.delete(stub.uid)
    const current =
      state.current && connections.has(state.current)
        ? state.current
        : (connections.keys().next().value ?? null)
    return {
      ...state,
      connections,
      current,
      status: connections.size > 0 ? state.status : 'disconnected',
    }
  })
}

async function getHasInitialWagmiReconnectCandidate(): Promise<boolean> {
  return hasPersistedConnections() || hasPrivyEvmReconnectIntent()
}
