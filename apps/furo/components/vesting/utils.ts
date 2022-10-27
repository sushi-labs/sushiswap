import { tryParseAmount } from '@sushiswap/currency'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'

import { ZTokenToToken } from '../../lib/zod'
import { CreateVestingFormSchemaType } from './CreateForm'

type CalculateEndDatePayload = Partial<
  Pick<CreateVestingFormSchemaType, 'cliffEnabled' | 'cliff' | 'startDate' | 'stepPayouts' | 'stepConfig'>
>

export const calculateEndDate = ({
  cliffEnabled,
  cliff,
  startDate,
  stepPayouts,
  stepConfig,
}: CalculateEndDatePayload) => {
  if (!stepPayouts || !stepConfig) return undefined
  if (startDate && !cliffEnabled) return new Date(startDate.getTime() + stepConfig.time * stepPayouts * 1000)
  if (cliffEnabled && cliff?.cliffEndDate)
    return new Date(cliff.cliffEndDate.getTime() + stepConfig.time * stepPayouts * 1000)
  return undefined
}

type CalculateTotalAmount = Partial<
  Pick<CreateVestingFormSchemaType, 'currency' | 'cliff' | 'stepAmount' | 'stepPayouts'>
>

export const calculateTotalAmount = ({ currency, cliff, stepAmount, stepPayouts }: CalculateTotalAmount) => {
  if (!currency || !stepPayouts) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const _cliffAmount = tryParseAmount(cliff?.cliffAmount?.toString(), _currency)
  const _totalStep = tryParseAmount(stepAmount?.toString(), _currency)?.multiply(JSBI.BigInt(stepPayouts))

  if (_cliffAmount && !_totalStep) return _cliffAmount
  if (!_cliffAmount && _totalStep) return _totalStep
  if (_cliffAmount && _totalStep) return _totalStep.add(_cliffAmount)

  return undefined
}

type CalculateCliffDuration = Partial<Pick<CreateVestingFormSchemaType, 'cliffEnabled' | 'cliff' | 'startDate'>>

export const calculateCliffDuration = ({ cliffEnabled, cliff, startDate }: CalculateCliffDuration) => {
  let cliffDuration = JSBI.BigInt(0)
  if (cliffEnabled && cliff?.cliffEndDate && startDate) {
    cliffDuration = JSBI.BigInt((cliff.cliffEndDate.getTime() - startDate.getTime()) / 1000)
  }

  return cliffDuration
}

type CalculateStepPercentage = Partial<
  Pick<CreateVestingFormSchemaType, 'stepAmount' | 'currency' | 'cliff' | 'stepPayouts'>
>

export const calculateStepPercentage = ({ stepAmount, currency, cliff, stepPayouts }: CalculateStepPercentage) => {
  if (!currency || !stepAmount) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const totalAmount = calculateTotalAmount({ currency, cliff, stepAmount, stepPayouts })
  const _stepAmount = tryParseAmount(stepAmount.toString(), _currency)

  return totalAmount?.greaterThan(ZERO) && _stepAmount
    ? new Fraction(_stepAmount.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
    : JSBI.BigInt(0)
}
