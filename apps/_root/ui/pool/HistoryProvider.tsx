import { createContext, FC, ReactNode, useContext, useEffect, useRef } from 'react'

import { useRouter } from 'next/router'

interface HistoryProviderContext {
  path: string | null
  basePath: string | null
}

const Context = createContext<HistoryProviderContext | undefined>(undefined)

export const HistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { asPath, basePath } = useRouter()

  const ref = useRef<string | null>(null)
  const basePathRef = useRef<string | null>(null)

  useEffect(() => {
    ref.current = asPath
    basePathRef.current = basePath
  }, [asPath, basePath])

  return <Context.Provider value={{ path: ref.current, basePath: basePathRef.current }}>{children}</Context.Provider>
}

export const usePreviousRoute = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside History Context')
  }

  return context
}
