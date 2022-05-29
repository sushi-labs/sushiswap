import { JSBI } from '@sushiswap/math'

import { CreateVestingFormDataTransformed, CreateVestingFormDataValidated } from './types'

type TransformVestingFormData = (x: CreateVestingFormDataValidated) => CreateVestingFormDataTransformed

export const transformVestingFormData: TransformVestingFormData = (payload) => {
  const { startDate, cliffEndDate, cliff } = payload

  const _startDate = new Date(startDate)

  let cliffDuration = JSBI.BigInt(0)
  let _cliffEndDate = undefined
  if (cliff && cliffEndDate) {
    _cliffEndDate = new Date(cliffEndDate)
    cliffDuration = JSBI.BigInt((new Date(cliffEndDate).getTime() - _startDate.getTime()) / 1000)
  }

  return {
    ...payload,
    startDate: _startDate,
    cliffEndDate: _cliffEndDate,
    cliffDuration,
  }
}
