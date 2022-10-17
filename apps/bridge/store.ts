import { configureStore } from '@reduxjs/toolkit'

import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  // @ts-ignore
  reducer: {
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-ignore
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})
