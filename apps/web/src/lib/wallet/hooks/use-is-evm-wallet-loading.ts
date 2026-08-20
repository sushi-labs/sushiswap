'use client'

import { useWallets as usePrivyWallets } from '@privy-io/react-auth'
import { useConnection } from 'wagmi'
import { useAccount } from './use-account'

export function useIsEvmWalletLoading(): boolean {
  const account = useAccount('evm')
  const { ready } = usePrivyWallets()
  const { isConnecting, isReconnecting } = useConnection()

  return !account && (!ready || isConnecting || isReconnecting)
}
