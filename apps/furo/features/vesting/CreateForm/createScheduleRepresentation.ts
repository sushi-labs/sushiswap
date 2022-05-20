import { Amount, Token } from '@sushiswap/currency'
import { PeriodType } from 'features'
import { StepConfig } from 'features/vesting/CreateForm/types'

type CreateScheduleRepresentation = (x: {
  token: Token
  cliff: boolean
  cliffAmount: Amount<Token>
  stepAmount: Amount<Token>
  startDate: Date
  cliffEndDate: Date
  stepEndDate: Date
  stepConfig: StepConfig
}) => {
  id: string
  type: PeriodType
  time: Date
  amount: Amount<Token>
}[]

export const createScheduleRepresentation: CreateScheduleRepresentation = ({
  token,
  cliff,
  cliffAmount,
  stepAmount,
  stepConfig,
  startDate,
  cliffEndDate,
  stepEndDate,
}) => {
  const periods = [
    {
      id: 'start',
      type: PeriodType.START,
      time: startDate,
      amount: Amount.fromRawAmount(token, '0'),
    },
  ]

  if (cliff) {
    periods.push({
      id: 'cliff',
      type: PeriodType.CLIFF,
      time: cliffEndDate,
      amount: cliffAmount,
    })
  }

  for (
    let i = cliffEndDate.getTime() + stepConfig.time * 1000;
    i < stepEndDate.getTime();
    i += stepConfig.time * 1000
  ) {
    periods.push({
      id: `step:${i}`,
      type: PeriodType.STEP,
      time: new Date(i),
      amount: stepAmount,
    })
  }

  periods.push({
    id: 'end',
    type: PeriodType.END,
    time: stepEndDate,
    amount: stepAmount,
  })

  return periods
}
