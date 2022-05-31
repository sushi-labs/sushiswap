import { configureStore } from '@reduxjs/toolkit'
import { createMigrate, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import migrations from './migrations'
import reducer from './reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'slippage']

const persistConfig = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  version: 3,
  storage,
  migrate: createMigrate(migrations, { debug: process.env.NODE_ENV === 'development' }),
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

export type AppState = ReturnType<typeof persistedReducer>
export type AppDispatch = typeof store.dispatch

export default store
