'use client'

import { createContext, useContext } from 'react'
import once from 'lodash.once'

interface EdgeConfigProviderProps<T extends unknown> {
  config: T
  children: React.ReactNode
}

const createEdgeConfigContext = once(<T = unknown>() => {
  return createContext<T | null>(null)
})

const useEdgeConfig = <T = unknown>() => {
  const context = useContext(createEdgeConfigContext<T>())
  if (!context) {
    throw new Error('useEdgeConfig must be used within a EdgeConfigProvider')
  }

  return context
}

const EdgeProvider = <T extends unknown>({
  config,
  children,
}: EdgeConfigProviderProps<T>) => {
  const EdgeContext = createEdgeConfigContext<T>()
  return <EdgeContext.Provider value={config}>{children}</EdgeContext.Provider>
}

export { EdgeProvider, useEdgeConfig }
