'use client'

import * as Sentry from '@sentry/nextjs'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
} from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

const queryClientConfig = {
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof Error) {
        if (error.name === 'ConnectorNotConnectedError') return
      }
      Sentry.captureException(error, { data: { query } })
    },
  }),
}

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return new QueryClient(queryClientConfig)
  }

  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = new QueryClient(queryClientConfig)
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
