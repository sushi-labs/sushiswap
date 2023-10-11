import * as Sentry from '@sentry/nextjs'
import { QueryCache, QueryClient } from '@tanstack/react-query'

const queryClientConfig = {
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      Sentry.captureException(error)
    },
  }),
  // deprecated in next version so there's no point using
  // logger: {
  //   log: (message) => {
  //     Sentry.captureMessage(message)
  //   },
  //   warn: (message) => {
  //     Sentry.captureMessage(message)
  //   },
  //   error: (error) => {
  //     Sentry.captureException(error)
  //   },
  // },
}

export const queryClient = new QueryClient(queryClientConfig)

export * from './hooks'

// Re-export react-query
// export * from '@tanstack/react-query'
