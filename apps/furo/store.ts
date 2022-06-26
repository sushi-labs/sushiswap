import { configureStore } from '@reduxjs/toolkit'
import { multicall } from 'lib/state/multicall'
import { tokenLists } from 'lib/state/token-lists'

import { storage, storageMiddleware } from './lib/state/storage'

export const store: ReturnType<typeof configureStore> = configureStore({
  // @ts-ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [multicall.reducerPath]: multicall.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})

export default store
