import {
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
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { WagmiContext, WagmiProvider, useConnection } from 'wagmi'
import type { WalletNamespaceContext } from '../../types'
import { EvmAdapterConfig } from '../config'
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

export function EvmWalletProvider({ children }: { children: React.ReactNode }) {
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
  const { isConnected, address, connector } = useConnection()

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!isEvmWallet(wallet)) {
        throw new Error(`Invalid namespace for ${wallet.name}`)
      }

      const connector = await EvmAdapterConfig[wallet.adapterId]({
        uid: wallet.uid,
      })

      const { accounts } = await wagmiConnect(getWagmiConfig(), { connector })
      onSuccess?.(accounts[0])
    },
    [],
  )

  const disconnect = useCallback(async () => {
    await wagmiDisconnect(getWagmiConfig())
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
    if (!isConnected || !connector?.id || !address) {
      clearWalletConnections('evm')
      return
    }

    addWalletConnection({
      id: `evm:${connector.id.toLowerCase()}`,
      name: connector.name,
      namespace: 'evm',
      account: address,
    })
  }, [isConnected, connector?.id, connector?.name, address])

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}
