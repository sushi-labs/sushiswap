import { createReducer } from '@reduxjs/toolkit'

import { Field, replaceCreateState, selectCurrency, switchCurrencies, typeInput } from './actions'

export interface CreateState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.COLLATERAL]: {
    readonly currencyId?: string
  }
  readonly [Field.ASSET]: {
    readonly currencyId?: string
  }
}

const initialState: CreateState = {
  independentField: Field.COLLATERAL,
  typedValue: '',
  [Field.COLLATERAL]: {
    currencyId: '',
  },
  [Field.ASSET]: {
    currencyId: '',
  },
}

export default createReducer<CreateState>(initialState, (builder) =>
  builder
    .addCase(replaceCreateState, (state, { payload: { typedValue, field, collateralId, assetId } }) => {
      return {
        [Field.COLLATERAL]: {
          currencyId: collateralId,
        },
        [Field.ASSET]: {
          currencyId: assetId,
        },
        independentField: field,
        typedValue: typedValue,
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.COLLATERAL ? Field.ASSET : Field.COLLATERAL
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.COLLATERAL ? Field.ASSET : Field.COLLATERAL,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId },
        }
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.COLLATERAL ? Field.ASSET : Field.COLLATERAL,
        [Field.COLLATERAL]: { currencyId: state[Field.ASSET].currencyId },
        [Field.ASSET]: { currencyId: state[Field.COLLATERAL].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
)
