import { configureStore } from '@reduxjs/toolkit'
import { multicall } from 'lib/state/multicall'
import { tokenLists } from 'lib/state/token-lists'

export const store: ReturnType<typeof configureStore> = configureStore({
  // @ts-ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [multicall.reducerPath]: multicall.reducer,
  },
})

export default store
