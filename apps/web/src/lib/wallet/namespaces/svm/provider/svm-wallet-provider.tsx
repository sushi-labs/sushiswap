'use client'

import type { ConnectorClient, WalletConnectorId } from '@solana/connector'
import {
  AppProvider as SvmConnectorProvider,
  useConnector,
  useConnectorClient,
  useWalletInfo,
} from '@solana/connector/react'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { getConnectorConfig } from 'src/app/(networks)/(non-evm)/solana/_common/config/connector'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet/hooks/use-privy-embedded'
import {
  setPrivySvmReconnect,
  shouldReconnectPrivySvm,
} from 'src/lib/wallet/privy-session-marker'
import {
  connectPrivySvmWallet,
  logoutPrivyRuntime,
  usePrivyRuntime,
} from 'src/lib/wallet/privy/use-privy-runtime'
import { waitForValue } from 'src/lib/wallet/privy/wait-for-value'
import { getWalletRestorationState } from 'src/lib/wallet/provider/get-wallet-restoration-state'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections as getWalletConnections,
  setWalletNamespaceRestoring,
} from 'src/lib/wallet/provider/store'
import { useInitialWalletAutoConnectPending } from 'src/lib/wallet/provider/use-initial-wallet-auto-connect-pending'
import type { Wallet } from 'src/lib/wallet/types'
import { SvmChainId } from 'sushi/svm'
import type { WalletNamespaceContext } from '../../types'
import { SvmAdapterId } from '../config'
import { useRegisterPrivySvmWallet } from './use-register-privy-svm-wallet'

function useInSvmContext(): boolean {
  const client = useConnectorClient()
  return client !== null
}

const SvmWalletContext = createContext<WalletNamespaceContext | null>(null)

export function useSvmWalletContext() {
  const ctx = useContext(SvmWalletContext)
  if (!ctx)
    throw new Error(
      'useSvmWalletContext must be used within <SvmWalletProvider>',
    )
  return ctx
}

export default function SvmWalletProvider({
  children,
}: { children: React.ReactNode }) {
  const inSvmContext = useInSvmContext()

  if (inSvmContext) {
    return <_SvmWalletProvider>{children}</_SvmWalletProvider>
  } else {
    return (
      <SvmConnectorProvider connectorConfig={getConnectorConfig()}>
        <_SvmWalletProvider>{children}</_SvmWalletProvider>
      </SvmConnectorProvider>
    )
  }
}

function _SvmWalletProvider({ children }: { children: React.ReactNode }) {
  const client = useConnectorClient()
  useRegisterPrivySvmWallet()
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('svm')
  const privyRuntime = usePrivyRuntime()
  const walletInfo = useWalletInfo()
  const {
    disconnectWallet: svmDisconnect,
    connectWallet,
    wallet: _connector,
  } = useConnector()
  const isAutoConnectPending = useInitialWalletAutoConnectPending({
    getHasReconnectCandidate: getHasInitialSvmReconnectCandidate,
    isConnectionAttemptActive: _connector.status !== 'disconnected',
  })

  const isConnected = _connector.status === 'connected'
  const connector =
    _connector.status === 'connected' ? _connector.session : undefined

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!client) throw new Error('SVM client not found')
      if (wallet.adapterId === SvmAdapterId.Privy) {
        const account = await connectPrivySvmWallet()
        const connectorId = await waitForPrivyConnector(client)
        setPrivySvmReconnect(true)
        try {
          await connectWallet(connectorId)
        } catch (error) {
          setPrivySvmReconnect(false)
          throw error
        }
        onSuccess?.(account)
        return
      }

      setPrivySvmReconnect(false)

      const { connectors, wallet: connectedWallet } = client.getSnapshot()

      const connectorId = connectors.find(
        (connector) => connector.name === wallet.name,
      )?.id

      if (!connectorId) throw new Error('SVM connector not found')
      if (
        connectedWallet.status === 'connected' &&
        connectedWallet.session.connectorId === connectorId
      ) {
        onSuccess?.(connectedWallet.session.selectedAccount.address.toString())
        return
      } else {
        await connectWallet(connectorId)
        const connectedState = client.getSnapshot().wallet
        if (connectedState.status !== 'connected') {
          throw new Error('SVM wallet did not connect')
        }
        onSuccess?.(connectedState.session.selectedAccount.address.toString())
      }
    },
    [client, connectWallet],
  )

  const disconnect = useCallback(async () => {
    const disconnectsPrivy = Boolean(
      client && connector && isPrivyConnector(client, connector.connectorId),
    )
    if (disconnectsPrivy) setPrivySvmReconnect(false)
    await svmDisconnect()
    if (disconnectsPrivy) await logoutPrivyRuntime()
  }, [client, connector, svmDisconnect])

  useEffect(() => {
    if (
      !client ||
      !privyEmbeddedWallet ||
      _connector.status !== 'disconnected'
    ) {
      return
    }
    if (!shouldReconnectPrivySvm()) return

    let cancelled = false
    waitForPrivyConnector(client)
      .then((connectorId) => {
        if (!cancelled) return connectWallet(connectorId)
      })
      .catch((error) => {
        if (!cancelled) console.warn('Privy SVM auto-connect failed', error)
      })
    return () => {
      cancelled = true
    }
  }, [client, connectWallet, _connector.status, privyEmbeddedWallet])

  const value = useMemo(
    () => ({
      isConnected,
      account: isConnected
        ? connector?.selectedAccount.address.toString()
        : undefined,
      connect,
      disconnect,
    }),
    [isConnected, connector?.selectedAccount.address, connect, disconnect],
  )

  useEffect(() => {
    if (!isConnected || !connector) {
      clearWalletConnections('svm')
      return
    }

    if (client && !isPrivyConnector(client, connector.connectorId)) {
      setPrivySvmReconnect(false)
    }

    addWalletConnection({
      chainId: SvmChainId.SOLANA,
      id: `svm:${connector.connectorId.toLowerCase()}`,
      name: walletInfo.name ?? '',
      namespace: 'svm',
      account: connector.selectedAccount.address,
      icon: walletInfo.icon ?? undefined,
    })
  }, [client, isConnected, connector, walletInfo.name, walletInfo.icon])

  useEffect(() => {
    const hasRegisteredConnection = getWalletConnections().some(
      (connection) => connection.namespace === 'svm',
    )

    setWalletNamespaceRestoring(
      'svm',
      getWalletRestorationState({
        hasRegisteredConnection,
        isProviderReady: privyRuntime.status !== 'loading',
        isAutoConnectPending,
        isConnecting: _connector.status === 'connecting',
        isConnected,
      }),
    )
  }, [
    _connector.status,
    isConnected,
    isAutoConnectPending,
    privyRuntime.status,
  ])

  return (
    <SvmWalletContext.Provider value={value}>
      {children}
    </SvmWalletContext.Provider>
  )
}

function getHasInitialSvmReconnectCandidate(): boolean {
  const persistedWallet = getConnectorConfig().storage?.wallet.get()
  return typeof persistedWallet === 'string' && persistedWallet.length > 0
}

function isPrivyConnector(
  client: ConnectorClient,
  connectorId: WalletConnectorId,
): boolean {
  return client
    .getSnapshot()
    .connectors.some(
      (connector) => connector.id === connectorId && connector.name === 'Privy',
    )
}

async function waitForPrivyConnector(
  client: ConnectorClient,
): Promise<WalletConnectorId> {
  const getConnectorId = () =>
    client
      .getSnapshot()
      .connectors.find((connector) => connector.name === 'Privy')?.id
  const nextConnectorId = await waitForValue<WalletConnectorId | undefined>({
    getValue: getConnectorId,
    predicate: Boolean,
    subscribe: (listener) => client.subscribe(listener),
    timeoutMessage: 'Privy SVM connector was not registered',
    timeoutMs: 10_000,
  })
  if (!nextConnectorId) {
    throw new Error('Privy SVM connector was not registered')
  }
  return nextConnectorId
}
