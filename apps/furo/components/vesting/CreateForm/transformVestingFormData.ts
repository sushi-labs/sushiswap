import { Native, Token, tryParseAmount } from '@sushiswap/currency'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'

import { CreateVestingFormData, CreateVestingFormDataTransformed } from '../types'

type TransformVestingFormData = (x: CreateVestingFormData) => CreateVestingFormDataTransformed

export const transformVestingFormData: TransformVestingFormData = (payload) => {
  const { startDate, cliffEndDate, cliff, currency, cliffAmount, stepAmount, stepPayouts, stepConfig } = payload
  const _currency = currency?.isNative
    ? Native.onChain(currency.chainId)
    : currency
    ? new Token({
        chainId: currency.chainId,
        decimals: currency.decimals,
        address: currency.wrapped.address,
        name: currency.name,
        symbol: currency.symbol,
      })
    : undefined

  const _startDate = new Date(startDate)

  let cliffDuration = JSBI.BigInt(0)
  let _cliffEndDate = undefined
  if (cliff && cliffEndDate) {
    _cliffEndDate = new Date(cliffEndDate)
    cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
  }

  const cliffAmountAsEntity = tryParseAmount(cliffAmount?.toString(), _currency)
  const stepAmountAsEntity = tryParseAmount(stepAmount.toString(), _currency)
  const totalStepAmountAsEntity = tryParseAmount(stepAmount.toString(), _currency)?.multiply(
    JSBI.BigInt(stepPayouts || 1)
  )
  let totalAmount = totalStepAmountAsEntity

  if (cliffAmountAsEntity && totalStepAmountAsEntity) {
    totalAmount = totalStepAmountAsEntity.add(cliffAmountAsEntity)
  }

  if (cliffAmountAsEntity && !totalStepAmountAsEntity) {
    totalAmount = cliffAmountAsEntity
  }

  const stepPercentage =
    totalAmount?.greaterThan(ZERO) && stepAmountAsEntity
      ? new Fraction(stepAmountAsEntity.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
      : JSBI.BigInt(0)

  const endDate =
    ((cliff && cliffEndDate) || startDate) && stepPayouts
      ? new Date(
          new Date(cliff && cliffEndDate ? cliffEndDate : startDate).getTime() + stepConfig.time * stepPayouts * 1000
        )
      : undefined

  return {
    ...payload,
    currency: _currency,
    startDate: _startDate,
    cliffEndDate: _cliffEndDate,
    cliffDuration,
    cliffAmount: cliffAmountAsEntity,
    stepAmount: stepAmountAsEntity,
    totalAmount,
    stepPercentage,
    endDate,
  }
}
