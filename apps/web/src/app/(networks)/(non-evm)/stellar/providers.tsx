'use client'

import {
  type ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'
import { createContext, useContext, useEffect, useState } from 'react'
import { IS_TESTNET, NETWORK_PASSPHRASE } from './_common/lib/constants'

interface StellarWalletContextType {
  stellarWalletKit: StellarWalletsKit | null
  wallets: ISupportedWallet[]
  isLoading: boolean
  isConnected: boolean
  connectedAddress: string | null
  connectWallet: (walletId: string) => Promise<void>
  disconnectWallet: () => Promise<void>
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}

const StellarWalletContext = createContext<StellarWalletContextType>({
  stellarWalletKit: null,
  wallets: [],
  isLoading: false,
  isConnected: false,
  connectedAddress: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  signTransaction: async () => '',
  signAuthEntry: async () => '',
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [stellarWalletKit, setStellarWalletKit] =
    useState<StellarWalletsKit | null>(null)
  const [wallets, setWallets] = useState<ISupportedWallet[]>([])
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const PREFERRED_NETWORK = IS_TESTNET
    ? WalletNetwork.TESTNET
    : WalletNetwork.PUBLIC

  useEffect(() => {
    const setup = async () => {
      // Note: This should only be called once any time a user is connected to Stellar
      const kit: StellarWalletsKit = new StellarWalletsKit({
        network: PREFERRED_NETWORK,
        modules: allowAllModules(),
      })
      // Get/Set wallets
      const wallets = await kit.getSupportedWallets()

      // Set context values
      setStellarWalletKit(kit)
      setWallets(wallets)

      // Restore previous connection if it exists
      const savedWalletId = localStorage.getItem('stellarWalletId')
      if (savedWalletId) {
        kit.setWallet(savedWalletId)
        const { address } = await kit.getAddress()
        setConnectedAddress(address)
      }
      setIsLoading(false)
    }

    setup()

    return () => {
      setStellarWalletKit(null)
      setWallets([])
      setConnectedAddress(null)
      setIsLoading(true)
    }
  }, [PREFERRED_NETWORK])

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
    setConnectedAddress(address)
    localStorage.setItem('stellarWalletId', walletId)
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
    localStorage.removeItem('stellarWalletId')
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
      networkPassphrase: NETWORK_PASSPHRASE,
    })

    return signedTxXdr
  }

  /**
   * Signs a Soroban authorization entry
   * Used for nested authorization where the user is not the direct invoker
   * @param entryPreimageXdr - The XDR of the authorization entry preimage to sign
   * @returns The signed authorization entry (base64 signature)
   */
  const signAuthEntry = async (entryPreimageXdr: string) => {
    if (!stellarWalletKit || !connectedAddress) {
      throw new Error('Stellar wallet not connected')
    }

    const { signedAuthEntry } = await stellarWalletKit.signAuthEntry(
      entryPreimageXdr,
      {
        address: connectedAddress,
        networkPassphrase: NETWORK_PASSPHRASE,
      },
    )

    return signedAuthEntry
  }

  return (
    <StellarWalletContext.Provider
      value={{
        stellarWalletKit,
        wallets,
        isLoading,
        isConnected: connectedAddress !== null,
        connectedAddress,
        signTransaction,
        signAuthEntry,
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
