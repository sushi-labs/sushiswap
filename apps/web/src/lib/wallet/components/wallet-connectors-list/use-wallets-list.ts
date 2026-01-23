'use client'

import { useMemo } from 'react'
import { useWalletsRegistry } from './wallets-registry'

export const useWalletsList = () => {
  const { wallets } = useWalletsRegistry()

  return useMemo(() => Array.from(wallets.values()).flat(), [wallets])
}
