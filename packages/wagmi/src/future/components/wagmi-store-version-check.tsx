'use client'

import { FC, useEffect } from 'react'

interface WagmiStoreVersionCheckProps {
  children: React.ReactNode
}

export const WagmiStoreVersionCheck: FC<WagmiStoreVersionCheckProps> = ({ children }) => {
  useEffect(() => {
    const store = localStorage.getItem('wagmi.store')
    if (store) {
      const parsed = JSON.parse(store)
      if (parsed.version === 1) {
        localStorage.removeItem('wagmi.store')
      }
    }

    const cache = localStorage.getItem('wagmi.cache')
    if (cache) {
      const parsed = JSON.parse(cache)
      if (parsed.version === 1) {
        localStorage.removeItem('wagmi.cache')
      }
    }
  }, [])

  return <>{children}</>
}
