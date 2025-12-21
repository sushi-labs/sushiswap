import {
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
} from '@wagmi/core'
import type React from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import type { Wallet, WalletWithState } from 'src/lib/wallet/types'
import { WagmiContext, WagmiProvider, useConnection } from 'wagmi'
import { EvmAdapterConfig, type EvmAdapterId } from '../config'
import { isEvmWallet } from '../types'
import { useEvmWallets } from './use-evm-wallets'

function useInEvmContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

type EvmWalletContext = {
  wallets: WalletWithState[]
  isConnected: boolean
  account?: string
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet?: Wallet) => Promise<void>
}

const EvmWalletContext = createContext<EvmWalletContext | null>(null)

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
  const wallets = useEvmWallets()

  const connection = useConnection()

  const connect = useCallback(async (wallet: Wallet) => {
    if (!isEvmWallet(wallet)) {
      throw new Error(`Invalid namespace for ${wallet.name}`)
    }

    const connector = await EvmAdapterConfig[wallet.adapterId]({
      uid: wallet.uid,
    })

    await wagmiConnect(getWagmiConfig(), { connector })
  }, [])

  const disconnect = useCallback(async () => {
    await wagmiDisconnect(getWagmiConfig())
  }, [])

  const value = useMemo<EvmWalletContext>(
    () => ({
      wallets,
      isConnected: connection.isConnected,
      account: connection.address,
      connect,
      disconnect,
    }),
    [wallets, connection.isConnected, connection.address, connect, disconnect],
  )

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}
