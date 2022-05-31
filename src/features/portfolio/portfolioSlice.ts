import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import { ActiveModal } from '../trident/types'

export interface BalancesState {
  currency?: string
  activeModal: ActiveModal | undefined
  modalOpen: boolean
}

const initialState: BalancesState = {
  currency: undefined,
  activeModal: undefined,
  modalOpen: false,
}

export const portfolioSlice = createSlice({
  name: 'portfolioSlice',
  initialState,
  reducers: {
    setBalancesActiveModal: (
      state,
      action: PayloadAction<{ activeModal: ActiveModal | undefined; modalOpen?: boolean }>
    ) => {
      state.activeModal = action.payload.activeModal
      if (action.payload.modalOpen !== undefined) {
        state.modalOpen = action.payload.modalOpen
      }
    },
    setBalancesState: (state, action: PayloadAction<Pick<BalancesState, 'currency' | 'activeModal'>>) => {
      state.currency = action.payload.currency
      state.activeModal = action.payload.activeModal
      state.modalOpen = !!action.payload.currency && !!action.payload.activeModal
    },
    setBalancesModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
    },
  },
})

export const { setBalancesActiveModal, setBalancesState, setBalancesModalOpen } = portfolioSlice.actions

type selectTridentAdd = (state: AppState) => BalancesState
export const selectTridentBalances: selectTridentAdd = (state: AppState) => state.portfolio

export const selectBalancesCurrency = (state: AppState) => state.portfolio.currency

export default portfolioSlice.reducer
