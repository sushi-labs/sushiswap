import { JSBI } from '@sushiswap/math'
import { CreateVestingFormDataTransformed, CreateVestingFormDataValidated } from 'features/vesting/CreateForm/types'

type TransformVestingFormData = (x: CreateVestingFormDataValidated) => CreateVestingFormDataTransformed

export const transformVestingFormData: TransformVestingFormData = (payload) => {
  const { stepConfig, stepEndDate, startDate, cliffEndDate, cliff } = payload

  const _startDate = new Date(startDate)
  const _stepEndDate = new Date(stepEndDate)
  const _cliffEndDate = new Date(cliffEndDate)

  let cliffDuration = JSBI.BigInt(0)
  if (cliff && cliffEndDate) {
    cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
  }

  let totalStepDuration = cliffEndDate
    ? JSBI.BigInt((_stepEndDate.getTime() - new Date(cliffEndDate).getTime()) / 1000)
    : JSBI.BigInt((_stepEndDate.getTime() - _startDate.getTime()) / 1000)

  const steps =
    totalStepDuration && stepConfig && JSBI.greaterThan(JSBI.BigInt(stepConfig?.time), JSBI.BigInt('0'))
      ? JSBI.divide(totalStepDuration, JSBI.BigInt(stepConfig?.time))
      : JSBI.BigInt(1)
  const stepDuration =
    totalStepDuration && stepConfig && JSBI.greaterThan(steps, JSBI.BigInt('0'))
      ? JSBI.divide(totalStepDuration, steps)
      : JSBI.BigInt(1)

  return {
    ...payload,
    startDate: _startDate,
    stepEndDate: _stepEndDate,
    cliffEndDate: _cliffEndDate,
    steps,
    cliffDuration,
    stepDuration,
  }
}
