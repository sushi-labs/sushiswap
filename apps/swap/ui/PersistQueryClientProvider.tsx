import { persister, queryClient } from '@sushiswap/react-query'
import { PersistQueryClientProvider as _PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { FC, ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const PersistQueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <_PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return !query.queryKey.includes('NoPersist')
          },
        },
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          void queryClient.invalidateQueries()
        })
      }}
    >
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </_PersistQueryClientProvider>
  )
}
