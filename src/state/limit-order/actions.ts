import { Signature } from '@ethersproject/bytes'
import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export enum LimitPrice {
  CURRENT = 'CURRENT',
}

export const setLimitPrice = createAction<string | undefined>('limit-order/setLimitPrice')
export const setLimitOrderBentoPermit = createAction<Signature | undefined>('limit-order/setLimitBentoPermit')
export const setLimitOrderAttemptingTxn = createAction<boolean>('limit-order/setLimitAttemptingTxn')
export const setLimitOrderInvertRate = createAction<boolean>('limit-order/setLimitOrderInvertRate')
export const setLimitOrderInvertState = createAction<{ invertRate: boolean; limitPrice: string }>(
  'limit-order/setLimitOrderInvertState'
)
export const setOrderExpiration = createAction<
  | {
      value: string
      label: string
    }
  | undefined
>('limit-order/setOrderExpiration')
export const setFromBentoBalance = createAction<boolean>('limit-order/setFromBentoBalance')
export const setLimitOrderApprovalPending = createAction<string>('limit-order/setLimitOrderApprovalPending')
export const setLimitOrderShowReview = createAction<boolean>('limit-order/setLimitOrderShowReview')
export const replaceLimitOrderState = createAction<{
  independentField: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient?: string
  fromBentoBalance?: boolean
  limitPrice?: string
  orderExpiration?: { value: string; label: string }
}>('limit-order/replaceLimitOrderState')
export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('limit-order/selectCurrency')
export const switchCurrencies = createAction<void>('limit-order/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('limit-order/typeInput')
export const setRecipient = createAction<string | undefined>('limit-order/setRecipient')
export const clear = createAction<void>('limit-order/clear')
