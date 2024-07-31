import * as Sentry from '@sentry/nextjs'
import {
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from '@tanstack/react-query'

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

export const createQueryClient = (
  config: QueryClientConfig | undefined = queryClientConfig,
) => {
  return new QueryClient(config)
}

export * from './hooks'
