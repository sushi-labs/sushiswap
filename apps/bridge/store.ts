import { configureStore } from '@reduxjs/toolkit'

import { multicall } from './lib/state/multicall'
import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  // @ts-ignore
  reducer: {
    [multicall.reducerPath]: multicall.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})
