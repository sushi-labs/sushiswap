import { createAction } from '@reduxjs/toolkit'

export enum Field {
  COLLATERAL = 'COLLATERAL',
  ASSET = 'ASSET',
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
}>('create/selectCurrency')

export const switchCurrencies = createAction<void>('create/switchCurrencies')

export const typeInput = createAction<{ field: Field; typedValue: string }>('create/typeInput')

export const replaceCreateState = createAction<{
  field: Field
  typedValue: string
  collateralId?: string
  assetId?: string
}>('create/replaceCreateState')
