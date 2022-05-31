import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

export interface PoolsState {
  searchQuery: string
}

const initialState: PoolsState = {
  searchQuery: '',
}

export const poolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setPoolsSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setPoolsSearchQuery } = poolsSlice.actions

type selectPools = (state: AppState) => PoolsState

export const selectPools: selectPools = (state: AppState) => state.pools

export default poolsSlice.reducer
