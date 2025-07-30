'use client'

import {
  type ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'
import { createContext, useContext, useEffect, useState } from 'react'

interface StellarWalletContextType {
  stellarWalletKit: StellarWalletsKit | null
  wallets: ISupportedWallet[]
  connectedAddress: string | null
  connectWallet: (walletId: string) => Promise<void>
  disconnectWallet: () => Promise<void>
  signTransaction: (xdr: string) => Promise<string>
}

const StellarWalletContext = createContext<StellarWalletContextType>({
  stellarWalletKit: null,
  wallets: [],
  connectedAddress: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  signTransaction: async () => '',
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [stellarWalletKit, setStellarWalletKit] =
    useState<StellarWalletsKit | null>(null)
  const [wallets, setWallets] = useState<ISupportedWallet[]>([])
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)

  // TODO: update accordingly
  const preferredNetwork = WalletNetwork.TESTNET

  useEffect(() => {
    const setup = async () => {
      // Note: This should only be called once any time a user is connected to Stellar
      const kit: StellarWalletsKit = new StellarWalletsKit({
        network: preferredNetwork,
        modules: allowAllModules(),
      })
      // Get/Set wallets
      const wallets = await kit.getSupportedWallets()

      // Set context values
      setStellarWalletKit(kit)
      setWallets(wallets)
    }

    setup()

    // TODO: teardown
    return () => {}
  }, [])

  /**
   * Connects to a Stellar wallet
   * @param walletId - The ID of the wallet to connect to
   */
  const connectWallet = async (walletId: string) => {
    if (!stellarWalletKit) {
      throw new Error('Stellar Wallet Kit not initialized')
    }

    // Set wallet
    stellarWalletKit.setWallet(walletId)

    // Get/Set address
    const { address } = await stellarWalletKit.getAddress()
    console.log(`Connected with ${address}`)
    setConnectedAddress(address)
  }

  /**
   * Disconnects the current wallet
   */
  const disconnectWallet = async () => {
    if (!stellarWalletKit) {
      throw new Error('Stellar Wallet Kit not initialized')
    }
    await stellarWalletKit.disconnect()
    setConnectedAddress(null)
  }

  /**
   * Signs a Stellar transaction
   * @param xdr - The XDR transaction to sign
   * @returns The signed transaction
   */
  const signTransaction = async (xdr: string) => {
    if (!stellarWalletKit || !connectedAddress) {
      throw new Error('Stellar wallet not connected')
    }

    const { signedTxXdr } = await stellarWalletKit.signTransaction(xdr, {
      address: connectedAddress,
      networkPassphrase: preferredNetwork,
    })

    return signedTxXdr
  }

  return (
    <StellarWalletContext.Provider
      value={{
        stellarWalletKit,
        wallets,
        connectedAddress,
        signTransaction,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </StellarWalletContext.Provider>
  )
}

export const useStellarWallet = () => {
  const context = useContext(StellarWalletContext)
  if (!context) {
    throw new Error(
      'useStellarWallet hook must be used within a StellarWalletProvider',
    )
  }
  return context
}
