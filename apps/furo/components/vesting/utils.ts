import { tryParseAmount } from '@sushiswap/currency'
import { Fraction, ZERO } from '@sushiswap/math'

import { ZTokenToToken } from '../../lib/zod'
import { CreateVestingFormSchemaType, STEP_CONFIGURATIONS_MAP } from './schema'

export const calculateEndDate = ({
  cliffEnabled,
  cliffEndDate,
  startDate,
  stepPayouts,
  stepConfig,
}: Pick<CreateVestingFormSchemaType, 'cliffEnabled' | 'cliffEndDate' | 'startDate' | 'stepPayouts' | 'stepConfig'>) => {
  if (!stepPayouts || !stepConfig) return undefined
  if (startDate && !cliffEnabled)
    return new Date(startDate.getTime() + STEP_CONFIGURATIONS_MAP[stepConfig] * stepPayouts * 1000)
  if (cliffEnabled && cliffEndDate)
    return new Date(cliffEndDate.getTime() + STEP_CONFIGURATIONS_MAP[stepConfig] * stepPayouts * 1000)
  return undefined
}

export const calculateTotalAmount = ({
  currency,
  cliffEnabled,
  cliffAmount,
  stepAmount,
  stepPayouts,
}: Pick<CreateVestingFormSchemaType, 'currency' | 'cliffEnabled' | 'cliffAmount' | 'stepAmount' | 'stepPayouts'>) => {
  if (!currency || !stepPayouts) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const _cliffAmount = cliffEnabled ? tryParseAmount(cliffAmount?.toString(), _currency) : undefined
  const _totalStep = tryParseAmount(stepAmount?.toString(), _currency)?.multiply(BigInt(stepPayouts))

  if (_cliffAmount && !_totalStep) return _cliffAmount
  if (!_cliffAmount && _totalStep) return _totalStep
  if (_cliffAmount && _totalStep) return _totalStep.add(_cliffAmount)

  return undefined
}

export const calculateCliffDuration = ({
  cliffEnabled,
  cliffEndDate,
  startDate,
}: Pick<CreateVestingFormSchemaType, 'cliffEndDate' | 'cliffEnabled' | 'startDate'>) => {
  let cliffDuration = 0n
  if (cliffEnabled && cliffEndDate && startDate && cliffEndDate > startDate) {
    cliffDuration = BigInt(Math.floor((cliffEndDate.getTime() - startDate.getTime()) / 1000))
  }

  return cliffDuration
}

export const calculateStepPercentage = ({
  currency,
  cliffEnabled,
  cliffAmount,
  stepAmount,
  stepPayouts,
}: Pick<CreateVestingFormSchemaType, 'currency' | 'cliffEnabled' | 'cliffAmount' | 'stepAmount' | 'stepPayouts'>) => {
  if (!currency || !stepAmount) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const totalAmount = calculateTotalAmount({
    currency,
    cliffEnabled,
    cliffAmount,
    stepAmount,
    stepPayouts,
  })
  const _stepAmount = tryParseAmount(stepAmount.toString(), _currency)

  return totalAmount?.greaterThan(ZERO) && _stepAmount
    ? new Fraction(_stepAmount.multiply(BigInt(1e18)).quotient, totalAmount.quotient).quotient
    : 0n
}
