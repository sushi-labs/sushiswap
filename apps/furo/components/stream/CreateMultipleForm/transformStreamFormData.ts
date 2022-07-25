import { Native, Token, tryParseAmount } from '@sushiswap/currency'

import { CreateStreamFormDataTransformed, CreateStreamFormDataValidated } from '../types'

type TransformStreamFormData = (x: CreateStreamFormDataValidated) => CreateStreamFormDataTransformed

export const transformStreamFormData: TransformStreamFormData = (payload) => {
  const { startDate, endDate, currency, amount } = payload
  const _currency = currency?.isNative
    ? Native.onChain(currency.chainId)
    : currency
    ? new Token({
        chainId: currency.chainId,
        decimals: currency.decimals,
        address: currency.address,
        name: currency.name,
        symbol: currency.symbol,
      })
    : undefined

  const _startDate = new Date(startDate)
  const _endDate = new Date(endDate)
  const totalAmount = tryParseAmount(amount, _currency)

  return {
    ...payload,
    startDate: _startDate,
    endDate: _endDate,
    amount: totalAmount,
  }
}
