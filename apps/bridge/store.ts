import { configureStore } from '@reduxjs/toolkit'

import { storage, storageMiddleware } from './lib/state/storage'

export const store = configureStore({
  reducer: {
    [storage.reducerPath]: storage.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})
