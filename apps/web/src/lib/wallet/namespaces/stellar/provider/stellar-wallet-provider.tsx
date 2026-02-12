'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { StellarChainId } from 'sushi/stellar'
import type { WalletNamespaceContext } from '../../types'
import { stellarWalletKit } from '../config'

// function useInStellarContext(): boolean {
//   const client = useConnectorClient()
//   return client !== null
// }

const StellarWalletContext = createContext<WalletNamespaceContext | null>(null)

export function useStellarWalletContext() {
  const ctx = useContext(StellarWalletContext)
  if (!ctx)
    throw new Error(
      'useStellarWalletContext must be used within <StellarWalletProvider>',
    )
  return ctx
}

export default function StellarWalletProvider({
  children,
}: { children: React.ReactNode }) {
  return <_StellarWalletProvider>{children}</_StellarWalletProvider>
}

function _StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  // const [prevWallet, setPrevWallet] = useLocalStorage<Wallet | null>(
  //   'sushi.stellar.wallet-id',
  //   null,
  // )

  // // biome-ignore lint/correctness/useExhaustiveDependencies: autoconnect helper
  // useEffect(() => {
  //   const autoConnect = async () => {
  //     if (!stellarWalletKit || !prevWallet) return
  //     try {
  //       const id = prevWallet.id?.split(':')?.[1]
  //       if (!id) throw new Error('Invalid wallet id')
  //       stellarWalletKit.setWallet(id)
  //       const { address } = await stellarWalletKit.getAddress()
  //       setAccount(address)
  //     } catch (error) {
  //       console.error('Failed to auto-connect to Stellar wallet:', error)
  //       setPrevWallet(null)
  //     }
  //   }
  //   // autoConnect()
  // }, [])

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!stellarWalletKit) throw new Error('Stellar client not found')

      // const { connectors, wallet: connectedWallet } = client.getSnapshot()

      // const connectorId = connectors.find(
      //   (connector) => connector.name === wallet.name,
      // )?.id

      // if (!connectorId) throw new Error('Stellar connector not found')
      const id = wallet.id?.split(':')?.[1]
      if (!id) throw new Error('Invalid wallet id')
      stellarWalletKit.setWallet(id)
      // setPrevWallet(wallet)
      setWallet(wallet)
      const { address } = await stellarWalletKit.getAddress()
      setAccount(address)
      if (address) {
        onSuccess?.(address)
      } else {
        stellarWalletKit.setWallet(id)
        const { address } = await stellarWalletKit.getAddress()
        setAccount(address)
        onSuccess?.(address)
      }
    },
    [],
  )

  const disconnect = useCallback(async () => {
    if (!stellarWalletKit) throw new Error('Stellar client not found')
    await stellarWalletKit.disconnect()
    // setPrevWallet(null)
    setAccount(undefined)
    setWallet(null)
  }, [])

  const value = useMemo(
    () => ({
      isConnected: Boolean(account),
      account,
      connect,
      disconnect,
    }),
    [account, connect, disconnect],
  )

  useEffect(() => {
    if (!account || !wallet) {
      clearWalletConnections('stellar')
      return
    }
    const _wallet = wallet

    addWalletConnection({
      chainId: StellarChainId.STELLAR,
      id: `stellar:${_wallet.id}`,
      name: _wallet.name ?? '',
      namespace: 'stellar',
      account: account,
      icon: _wallet.icon ?? undefined,
    })
  }, [account, wallet])

  return (
    <StellarWalletContext.Provider value={value}>
      {children}
    </StellarWalletContext.Provider>
  )
}
