'use client'

import { type ConnectedWallet, useWallets } from '@privy-io/react-auth'
import {
  type ConnectedStandardSolanaWallet,
  useWallets as useSolWallets,
} from '@privy-io/react-auth/solana'
import { getEmbeddedPrivyWallet } from 'src/lib/wallet/privy'

type Namespace = 'evm' | 'svm'

export function usePrivyEmbeddedWallet(
  namespace: 'evm',
): ConnectedWallet | undefined

export function usePrivyEmbeddedWallet(
  namespace: 'svm',
): ConnectedStandardSolanaWallet | undefined

export function usePrivyEmbeddedWallet(
  namespace: Namespace,
): ConnectedWallet | ConnectedStandardSolanaWallet | undefined {
  const { wallets } = useWallets()
  const { wallets: solWallets } = useSolWallets()

  if (namespace === 'svm') {
    return getEmbeddedPrivyWallet(solWallets, 'svm')
  }

  return getEmbeddedPrivyWallet(wallets, 'evm')
}
