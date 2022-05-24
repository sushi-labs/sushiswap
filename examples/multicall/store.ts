import { configureStore } from '@reduxjs/toolkit'

import { multicall } from './multicall'

export const store = configureStore({
  reducer: {
    [multicall.reducerPath]: multicall.reducer,
  },
})
