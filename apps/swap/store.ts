import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'

import { multicall } from './lib/state/multicall'
import { settings } from './lib/state/settings'

export const store = configureStore({
  reducer: {
    [multicall.reducerPath]: multicall.reducer,
    [tokenLists.reducerPath]: tokenLists.reducer,
    [settings.reducerPath]: settings.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...settings.middleware),
})
