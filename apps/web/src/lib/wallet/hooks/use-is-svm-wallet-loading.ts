'use client'

import { useStandardWallets } from '@privy-io/react-auth/solana'
import { useConnector } from '@solana/connector/react'
import { useAccount } from './use-account'

export function useIsSvmWalletLoading(): boolean {
  const account = useAccount('svm')
  const { ready } = useStandardWallets()
  const { wallet } = useConnector()

  if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
    return false
  }

  return !account && (!ready || wallet.status === 'connecting')
}
