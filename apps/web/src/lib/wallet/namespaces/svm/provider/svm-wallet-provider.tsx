import {
  ConnectionContext,
  ConnectionProvider,
  WalletContext,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import type React from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import type { Wallet, WalletWithState } from 'src/lib/wallet/types'
import { useSvmWallets } from './use-svm-wallets'

function useInSvmContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
}

type SvmWalletContext = {
  wallets: WalletWithState[]
  isConnected: boolean
  account?: string
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet?: Wallet) => Promise<void>
}

const SvmWalletContext = createContext<SvmWalletContext | null>(null)

export function useSvmWalletContext() {
  const ctx = useContext(SvmWalletContext)
  if (!ctx)
    throw new Error(
      'useSvmWalletContext must be used within <SvmWalletProvider>',
    )
  return ctx
}

export function SvmWalletProvider({ children }: { children: React.ReactNode }) {
  const inSvmContext = useInSvmContext()

  if (inSvmContext) {
    return <_SvmWalletProvider>{children}</_SvmWalletProvider>
  } else {
    const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']
    return (
      <ConnectionProvider
        endpoint={`https://lb.drpc.live/ogrpc?network=solana&dkey=${drpcId}`}
      >
        <WalletProvider wallets={[]}>
          <_SvmWalletProvider>{children}</_SvmWalletProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  }
}

function _SvmWalletProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(WalletContext)
  console.log('svm-context', context)
  const wallets = useSvmWallets()
  console.log('svm-wallets', wallets)
  const {
    connected,
    publicKey,
    connect: svmConnect,
    disconnect: svmDisconnect,
    select,
  } = useWallet()

  const connect = useCallback(
    async (wallet: Wallet) => {
      const name = wallet.name
      console.log('connect', wallet)
      select(name as string & { __brand__: 'WalletName' })
      await svmConnect()
    },
    [select, svmConnect],
  )

  const disconnect = useCallback(async () => {
    await svmDisconnect()
  }, [svmDisconnect])

  const value = useMemo<SvmWalletContext>(
    () => ({
      wallets,
      isConnected: connected,
      account: publicKey?.toBase58(),
      connect,
      disconnect,
    }),
    [wallets, connected, publicKey, connect, disconnect],
  )

  return (
    <SvmWalletContext.Provider value={value}>
      {children}
    </SvmWalletContext.Provider>
  )
}
