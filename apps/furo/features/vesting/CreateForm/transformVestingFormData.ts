import { JSBI } from '@sushiswap/math'
import { CreateVestingFormDataTransformed, CreateVestingFormDataValidated } from 'features/vesting/CreateForm/types'

type TransformVestingFormData = (x: CreateVestingFormDataValidated) => CreateVestingFormDataTransformed

export const transformVestingFormData: TransformVestingFormData = (payload) => {
  const { startDate, cliffEndDate, cliff } = payload

  const _startDate = new Date(startDate)
  const _cliffEndDate = new Date(cliffEndDate)

  let cliffDuration = JSBI.BigInt(0)
  if (cliff && cliffEndDate) {
    cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
  }

  return {
    ...payload,
    startDate: _startDate,
    cliffEndDate: _cliffEndDate,
    cliffDuration,
  }
}
