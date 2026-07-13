'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'
import { getWagmiInitialState } from '../config'

export type PersistedWagmiState = ReturnType<typeof getWagmiInitialState>

const WagmiPersistedStateContext = createContext<PersistedWagmiState>(undefined)

export function WagmiPersistedStateProvider({
  children,
  cookie,
}: {
  children: ReactNode
  cookie: string | undefined
}) {
  const [persistedState] = useState<PersistedWagmiState>(() => {
    try {
      return getWagmiInitialState(cookie)
    } catch (error) {
      console.warn('Failed to read persisted EVM connection', error)
      return undefined
    }
  })

  return (
    <WagmiPersistedStateContext.Provider value={persistedState}>
      {children}
    </WagmiPersistedStateContext.Provider>
  )
}

export function usePersistedWagmiState(): PersistedWagmiState {
  return useContext(WagmiPersistedStateContext)
}
