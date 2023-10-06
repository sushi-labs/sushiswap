import * as Sentry from '@sentry/nextjs'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'

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

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
const createIndexedDBPersister = (idbValidKey: IDBValidKey = 'reactQuery') => {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } as Persister
}

export const persister = createIndexedDBPersister('sushi')
