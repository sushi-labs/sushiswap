import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

export interface TokensState {
  searchQuery: string
}

const initialState: TokensState = {
  searchQuery: '',
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokensSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { setTokensSearchQuery } = tokensSlice.actions

type selectTokens = (state: AppState) => TokensState

export const selectTokens: selectTokens = (state: AppState) => state.tokens

export default tokensSlice.reducer
