import { configureStore } from '@reduxjs/toolkit'

import { tokenLists } from './token-lists'

export const store = configureStore({
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
  },
})
