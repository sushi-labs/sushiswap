'use client'

import { FC, useEffect } from 'react'

interface WagmiStoreVersionCheckProps {
  children: React.ReactNode
}

export const WagmiStoreVersionCheck: FC<WagmiStoreVersionCheckProps> = ({ children }) => {
  useEffect(() => {
    const store = localStorage.getItem('wagmi.cache')
    if (store && store.includes('BigNumber')) {
      localStorage.removeItem('wagmi.cache')
      localStorage.removeItem('wagmi.store')
    }
  }, [])

  return <>{children}</>
}
