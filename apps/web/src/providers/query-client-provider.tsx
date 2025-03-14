'use client'

import {
  QueryCache,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import type { FC, ReactNode } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
    queryCache: new QueryCache(),
  })
}

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = makeQueryClient()
  }

  return clientQueryClientSingleton
}

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const client = getQueryClient()

  return (
    <_QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools initialonlyOpen={false} /> */}
    </_QueryClientProvider>
  )
}
