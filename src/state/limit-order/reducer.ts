import { Signature } from '@ethersproject/bytes'
import { createReducer } from '@reduxjs/toolkit'
import { AppState } from 'app/state'

import {
  clear,
  Field,
  replaceLimitOrderState,
  selectCurrency,
  setFromBentoBalance,
  setLimitOrderApprovalPending,
  setLimitOrderAttemptingTxn,
  setLimitOrderBentoPermit,
  setLimitOrderInvertRate,
  setLimitOrderInvertState,
  setLimitOrderShowReview,
  setLimitPrice,
  setOrderExpiration,
  setRecipient,
  switchCurrencies,
  typeInput,
} from './actions'

export enum OrderExpiration {
  never = 'never',
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
}

export interface LimitOrderState {
  readonly typedField: Field
  readonly typedValue: string
  readonly limitPrice: string
  readonly inputCurrencyId: string
  readonly outputCurrencyId: string
  readonly recipient?: string
  readonly fromBentoBalance: boolean
  readonly limitOrderApprovalPending: string
  readonly orderExpiration: {
    value: OrderExpiration | string
    label: string
  }
  readonly bentoPermit?: Signature
  readonly attemptingTxn: boolean
  readonly showReview: boolean
  readonly invertRate: boolean
}

const initialState: LimitOrderState = {
  typedField: Field.INPUT,
  typedValue: '',
  limitPrice: '',
  inputCurrencyId: 'ETH',
  outputCurrencyId: 'SUSHI',
  recipient: undefined,
  fromBentoBalance: false,
  limitOrderApprovalPending: '',
  orderExpiration: {
    value: OrderExpiration.never,
    label: 'Never',
  },
  bentoPermit: undefined,
  attemptingTxn: false,
  showReview: false,
  invertRate: false,
}

export default createReducer<LimitOrderState>(initialState, (builder) =>
  builder
    .addCase(
      // @ts-ignore TYPE NEEDS FIXING
      replaceLimitOrderState,
      (
        state,
        {
          payload: {
            typedValue,
            recipient,
            independentField,
            inputCurrencyId,
            outputCurrencyId,
            fromBentoBalance,
            limitPrice,
            orderExpiration,
          },
        }
      ) => ({
        inputCurrencyId,
        outputCurrencyId,
        independentField,
        typedValue: typedValue,
        recipient,
        fromBentoBalance,
        limitPrice,
        orderExpiration,
        limitOrderApprovalPending: state.limitOrderApprovalPending,
      })
    )
    .addCase(setLimitPrice, (state, { payload: limitPrice }) => {
      // @ts-ignore TYPE NEEDS FIXING
      state.limitPrice = limitPrice
    })
    .addCase(setLimitOrderApprovalPending, (state, { payload: limitOrderApprovalPending }) => {
      state.limitOrderApprovalPending = limitOrderApprovalPending
    })
    .addCase(setOrderExpiration, (state, { payload: orderExpiration }) => {
      // @ts-ignore TYPE NEEDS FIXING
      state.orderExpiration = orderExpiration
    })
    .addCase(setFromBentoBalance, (state, { payload: fromBentoBalance }) => {
      state.fromBentoBalance = fromBentoBalance
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      if (field === Field.INPUT) {
        state.limitPrice = ''
        state.inputCurrencyId = currencyId
      }
      if (field === Field.OUTPUT) {
        state.limitPrice = ''
        state.outputCurrencyId = currencyId
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        inputCurrencyId: state.outputCurrencyId,
        outputCurrencyId: state.inputCurrencyId,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      state.typedField = field
      state.typedValue = typedValue
    })
    .addCase(setRecipient, (state, { payload: recipient }) => {
      state.recipient = recipient
    })
    .addCase(clear, () => {
      return {
        ...initialState,
      }
    })
    .addCase(setLimitOrderBentoPermit, (state, { payload: bentoPermit }) => {
      state.bentoPermit = bentoPermit
    })
    .addCase(setLimitOrderAttemptingTxn, (state, { payload: attemptingTxn }) => {
      state.attemptingTxn = attemptingTxn
    })
    .addCase(setLimitOrderShowReview, (state, { payload: showReview }) => {
      state.showReview = showReview
    })
    .addCase(setLimitOrderInvertRate, (state, { payload: invertRate }) => {
      state.invertRate = invertRate
    })
    .addCase(setLimitOrderInvertState, (state, { payload: { invertRate, limitPrice } }) => {
      state.invertRate = invertRate
      state.limitPrice = limitPrice
    })
)

type SelectLimitOrder = (state: AppState) => LimitOrderState
export const selectLimitOrder: SelectLimitOrder = (state: AppState) => state.limitOrder
