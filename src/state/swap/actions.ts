import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient?: string
}>('swap/replaceSwapState')
export const setRecipient = createAction<string | undefined>('swap/setRecipient')
export const setSushiRelayChallenge = createAction<string | undefined>('swap/setSushiRelayChallenge')
export const setFees = createAction<{ maxFee?: string; maxPriorityFee?: string }>('swap/setFees')
export const setMaxFee = createAction<string | undefined>('swap/setMaxFee')
export const setPriorityFee = createAction<string | undefined>('swap/setPriorityFee')
