'use client'

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
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { SvmChainId } from 'sushi/svm'
import type { WalletNamespaceContext } from '../../types'

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

  const walletInfo = useWalletInfo()

  const {
    disconnectWallet: svmDisconnect,
    connectWallet,
    wallet: _connector,
  } = useConnector()

  const isConnected = _connector.status === 'connected'
  const connector =
    _connector.status === 'connected' ? _connector.session : undefined

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!client) throw new Error('SVM client not found')

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
        return Promise.resolve()
      } else {
        return new Promise<void>((resolve, reject) => {
          const unsubscribe = client.subscribe((state) => {
            if (state.wallet.status === 'error') {
              unsubscribe()
              reject(state.wallet.error ?? new Error('SVM connect failed'))
            }

            if (state.wallet.status === 'connected') {
              unsubscribe()
              onSuccess?.(
                state.wallet.session.selectedAccount.address.toString(),
              )
              resolve()
            }
          })

          connectWallet(connectorId).catch((err) => {
            unsubscribe()
            reject(err)
          })
        })
      }
    },
    [client, connectWallet],
  )

  const disconnect = useCallback(async () => {
    await svmDisconnect()
  }, [svmDisconnect])

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

    addWalletConnection({
      chainId: SvmChainId.SOLANA,
      id: `svm:${connector.connectorId.toLowerCase()}`,
      name: walletInfo.name ?? '',
      namespace: 'svm',
      account: connector.selectedAccount.address,
      icon: walletInfo.icon ?? undefined,
    })
  }, [isConnected, connector, walletInfo.name, walletInfo.icon])

  return (
    <SvmWalletContext.Provider value={value}>
      {children}
    </SvmWalletContext.Provider>
  )
}
