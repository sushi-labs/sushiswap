import { tryParseAmount } from '@sushiswap/currency'
import { Fraction, JSBI, ZERO } from '@sushiswap/math'

import { ZTokenToToken } from '../../lib/zod'
import { CreateVestingFormSchemaType } from './CreateForm'

export const calculateEndDate = ({
  cliff,
  startDate,
  stepPayouts,
  stepConfig,
}: Pick<CreateVestingFormSchemaType, 'cliff' | 'startDate' | 'stepPayouts' | 'stepConfig'>) => {
  if (!stepPayouts || !stepConfig) return undefined
  if (startDate && !cliff.cliffEnabled) return new Date(startDate.getTime() + stepConfig.time * stepPayouts * 1000)
  if (cliff.cliffEnabled && cliff.cliffEndDate)
    return new Date(cliff.cliffEndDate.getTime() + stepConfig.time * stepPayouts * 1000)
  return undefined
}

export const calculateTotalAmount = ({
  currency,
  cliff,
  stepAmount,
  stepPayouts,
}: Pick<CreateVestingFormSchemaType, 'currency' | 'cliff' | 'stepAmount' | 'stepPayouts'>) => {
  if (!currency || !stepPayouts) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const _cliffAmount = cliff.cliffEnabled ? tryParseAmount(cliff.cliffAmount?.toString(), _currency) : undefined
  const _totalStep = tryParseAmount(stepAmount?.toString(), _currency)?.multiply(JSBI.BigInt(stepPayouts))

  if (_cliffAmount && !_totalStep) return _cliffAmount
  if (!_cliffAmount && _totalStep) return _totalStep
  if (_cliffAmount && _totalStep) return _totalStep.add(_cliffAmount)

  return undefined
}

export const calculateCliffDuration = ({
  cliff,
  startDate,
}: Pick<CreateVestingFormSchemaType, 'cliff' | 'startDate'>) => {
  let cliffDuration = JSBI.BigInt(0)
  if (cliff.cliffEnabled && cliff.cliffEndDate && startDate && cliff.cliffEndDate > startDate) {
    cliffDuration = JSBI.BigInt(Math.floor((cliff.cliffEndDate.getTime() - startDate.getTime()) / 1000))
  }

  return cliffDuration
}

export const calculateStepPercentage = ({
  currency,
  cliff,
  stepAmount,
  stepPayouts,
}: Pick<CreateVestingFormSchemaType, 'currency' | 'cliff' | 'stepAmount' | 'stepPayouts'>) => {
  if (!currency || !stepAmount) return undefined
  const _currency = ZTokenToToken.parse(currency)
  const totalAmount = calculateTotalAmount({
    currency,
    cliff,
    stepAmount,
    stepPayouts,
  })
  const _stepAmount = tryParseAmount(stepAmount.toString(), _currency)

  return totalAmount?.greaterThan(ZERO) && _stepAmount
    ? new Fraction(_stepAmount.multiply(JSBI.BigInt(1e18)).quotient, totalAmount.quotient).quotient
    : JSBI.BigInt(0)
}
