'use client'

import { createContext, useContext } from 'react'
import { useAccount } from 'src/lib/wallet'
import { stellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import { useStellarWallets } from 'src/lib/wallet/namespaces/stellar/provider/use-stellar-wallets'
import { NETWORK_PASSPHRASE } from './_common/lib/constants'

interface StellarWalletContextType {
  isLoading: boolean
  isConnected: boolean
  connectedAddress: `G${string}` | undefined
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
}

const StellarWalletContext = createContext<StellarWalletContextType>({
  isLoading: false,
  isConnected: false,
  connectedAddress: undefined,
  signTransaction: async () => '',
  signAuthEntry: async () => '',
})

export function Providers({ children }: { children: React.ReactNode }) {
  const connectedAddress = useAccount('stellar')
  const wallets = useStellarWallets()
  const isLoading = Boolean(wallets.length === 0)

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

    if (typeof stellarWalletKit.signAuthEntry !== 'function') {
      throw new Error('Connected wallet does not support signAuthEntry')
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
        isLoading,
        isConnected: !!connectedAddress,
        connectedAddress,
        signTransaction,
        signAuthEntry,
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
