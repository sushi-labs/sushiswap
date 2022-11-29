import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'

import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})
