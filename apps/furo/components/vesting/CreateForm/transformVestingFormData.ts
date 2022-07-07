import { Native, tryParseAmount } from '@sushiswap/currency'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'

import { CreateVestingFormDataTransformed, CreateVestingFormDataValidated } from '../types'

type TransformVestingFormData = (x: CreateVestingFormDataValidated) => CreateVestingFormDataTransformed

export const transformVestingFormData: TransformVestingFormData = (payload) => {
  const { startDate, cliffEndDate, cliff, currency, cliffAmount, stepAmount, stepPayouts } = payload
  const _currency = currency.isNative ? Native.onChain(currency.chainId) : currency

  const _startDate = new Date(startDate)

  let cliffDuration = JSBI.BigInt(0)
  let _cliffEndDate = undefined
  if (cliff && cliffEndDate) {
    _cliffEndDate = new Date(cliffEndDate)
    cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
  }

  const cliffAmountAsEntity = tryParseAmount(cliffAmount?.toString(), _currency)
  const stepAmountAsEntity = tryParseAmount(stepAmount.toString(), _currency)
  const totalStepAmountAsEntity = tryParseAmount(stepAmount.toString(), _currency)?.multiply(JSBI.BigInt(stepPayouts))
  let totalAmount = totalStepAmountAsEntity

  if (cliffAmountAsEntity && totalStepAmountAsEntity) {
    totalAmount = totalStepAmountAsEntity.add(cliffAmountAsEntity)
  }

  const stepPercentage =
    totalAmount?.greaterThan(ZERO) && stepAmountAsEntity
      ? new Fraction(stepAmountAsEntity.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
      : JSBI.BigInt(0)

  return {
    ...payload,
    currency: _currency,
    startDate: _startDate,
    cliffEndDate: _cliffEndDate,
    cliffDuration,
    totalAmount,
    stepPercentage,
  }
}
