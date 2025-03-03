'use client'

import type React from 'react'
import { type FC, useEffect } from 'react'

interface WagmiStoreVersionCheckProps {
  children: React.ReactNode
}

export const WagmiStoreVersionCheck: FC<WagmiStoreVersionCheckProps> = ({
  children,
}) => {
  useEffect(() => {
    const store = localStorage.getItem('wagmi.cache')
    if (store?.includes('BigNumber')) {
      localStorage.removeItem('wagmi.cache')
      localStorage.removeItem('wagmi.store')
    }
  }, [])
  return <>{children}</>
}
