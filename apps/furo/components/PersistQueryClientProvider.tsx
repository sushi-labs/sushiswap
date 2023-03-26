import { persister, queryClient } from '@sushiswap/react-query'
import { PersistQueryClientProvider as _PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { FC, ReactNode } from 'react'

export const PersistQueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <_PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </_PersistQueryClientProvider>
  )
}
