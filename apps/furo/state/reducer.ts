import { combineReducers } from '@reduxjs/toolkit'
import multicall from 'app/state/multicall'
import lists from './lists/reducer'

const reducer = combineReducers({
  lists,
  multicall: multicall.reducer,
})

export default reducer
