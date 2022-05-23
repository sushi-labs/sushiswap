import { Amount, Token } from '@sushiswap/currency'
import { PeriodType } from 'features'
import { StepConfig } from 'features/vesting/CreateForm/types'

type CreateScheduleRepresentation = (x: {
  token: Token
  cliff: boolean
  cliffAmount: Amount<Token> | undefined
  stepAmount: Amount<Token>
  startDate: Date
  cliffEndDate: Date | undefined
  stepPayouts: number
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
  stepPayouts,
}) => {
  const periods = [
    {
      id: 'start',
      type: PeriodType.START,
      time: startDate,
      amount: Amount.fromRawAmount(token, '0'),
    },
  ]

  if (cliff && cliffEndDate && cliffAmount) {
    periods.push({
      id: 'cliff',
      type: PeriodType.CLIFF,
      time: cliffEndDate,
      amount: cliffAmount,
    })
  }

  let time = (cliff && cliffEndDate ? cliffEndDate : startDate).getTime()
  for (let i = 0; i < stepPayouts - 1; i++) {
    time += stepConfig.time * 1000
    periods.push({
      id: `step:${i}`,
      type: PeriodType.STEP,
      time: new Date(time),
      amount: stepAmount,
    })
  }

  time += stepConfig.time * 1000
  periods.push({
    id: 'end',
    type: PeriodType.END,
    time: new Date(time),
    amount: stepAmount,
  })

  return periods
}
