'use client'

import React from 'react'
import { PersistQueryClientProvider } from '../ui/PersistQueryClientProvider'
import { WagmiProvider } from '../ui/WagmiProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <PersistQueryClientProvider>{children}</PersistQueryClientProvider>
    </WagmiProvider>
  )
}
