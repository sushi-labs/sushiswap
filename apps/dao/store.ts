import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { multicall } from './multicall'

export const rootReducer = combineReducers({
  [multicall.reducerPath]: multicall.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
})