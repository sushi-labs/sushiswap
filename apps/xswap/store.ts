import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'

import { multicall } from './lib/state/multicall'
import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  // @ts-ignore
  reducer: {
    [multicall.reducerPath]: multicall.reducer,
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})
