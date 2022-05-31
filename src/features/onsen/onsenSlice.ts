import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnsenModalView } from 'app/features/onsen/enum'
import { AppState } from 'app/state'

export interface OnsenState {
  view?: OnsenModalView
  open: boolean
}

const initialState: OnsenState = {
  view: undefined,
  open: false,
}

export const onsenSlice = createSlice({
  name: 'onsen',
  initialState,
  reducers: {
    setOnsenModalView: (state, action: PayloadAction<OnsenModalView | undefined>) => {
      state.view = action.payload
    },
    setOnsenModalOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    setOnsenModalState: (state, action: PayloadAction<{ view: OnsenModalView; open: boolean }>) => {
      state.view = action.payload.view
      state.open = action.payload.open
    },
  },
})

export const { setOnsenModalView, setOnsenModalOpen, setOnsenModalState } = onsenSlice.actions

type selectOnsen = (state: AppState) => OnsenState
export const selectOnsen: selectOnsen = (state: AppState) => state.onsen
export default onsenSlice.reducer
