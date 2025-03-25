'use client'

import { WalletProvider } from './wallet-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
