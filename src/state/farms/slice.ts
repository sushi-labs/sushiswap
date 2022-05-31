import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

export interface FarmsState {
  searchQuery: string
}

const initialState: FarmsState = {
  searchQuery: '',
}

export const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    setFarmsSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setFarmsSearchQuery } = farmsSlice.actions

type selectFarms = (state: AppState) => FarmsState

export const selectFarms: selectFarms = (state: AppState) => state.farms

export default farmsSlice.reducer
