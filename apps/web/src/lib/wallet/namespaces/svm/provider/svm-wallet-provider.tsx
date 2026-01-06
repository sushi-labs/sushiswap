import {
  ConnectionContext,
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import type { WalletNamespaceContext } from '../../types'

function useInSvmContext(): boolean {
  const context = useContext(ConnectionContext)
  return Boolean(context?.connection)
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
        <WalletProvider wallets={[]} autoConnect>
          <_SvmWalletProvider>{children}</_SvmWalletProvider>
        </WalletProvider>
      </ConnectionProvider>
    )
  }
}

function _SvmWalletProvider({ children }: { children: React.ReactNode }) {
  const {
    connected,
    publicKey,
    disconnect: svmDisconnect,
    select: svmConnect,
    wallet,
    wallets,
  } = useWallet()

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      const name = wallet.name
      const adapter = wallets.find(
        ({ adapter }) => adapter.name === name,
      )?.adapter

      if (adapter) {
        if (adapter.connected && adapter.publicKey) {
          onSuccess?.(adapter.publicKey?.toString())
        } else {
          svmConnect(adapter.name)
          adapter.once('connect', (publicKey) => {
            onSuccess?.(publicKey.toString())
          })
        }
      } else {
        throw new Error('SVM adapter not found')
      }
    },
    [svmConnect, wallets],
  )

  const disconnect = useCallback(async () => {
    await svmDisconnect()
  }, [svmDisconnect])

  const value = useMemo(
    () => ({
      isConnected: connected,
      account: publicKey?.toBase58(),
      connect,
      disconnect,
    }),
    [connected, publicKey, connect, disconnect],
  )

  useEffect(() => {
    if (!connected || !wallet?.adapter.name || !publicKey) {
      clearWalletConnections('svm')
      return
    }

    addWalletConnection({
      id: `svm:${wallet.adapter.name.toLowerCase()}`,
      name: wallet.adapter.name,
      namespace: 'svm',
      account: publicKey.toString(),
    })
  }, [connected, wallet?.adapter.name, publicKey])

  return (
    <SvmWalletContext.Provider value={value}>
      {children}
    </SvmWalletContext.Provider>
  )
}
