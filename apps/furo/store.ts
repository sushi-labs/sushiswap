import { configureStore } from '@reduxjs/toolkit'

import { multicall } from './lib/state/multicall'
import { storage, storageMiddleware } from './lib/state/storage'
import { tokenLists } from './lib/state/token-lists'

export const store: ReturnType<typeof configureStore> = configureStore({
  // @ts-ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [multicall.reducerPath]: multicall.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})

export default store
