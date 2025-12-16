'use client'

import { useContext } from 'react'
import { WalletContext } from './context'

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('WalletProvider is missing')
  }
  return ctx
}
