import { Amount, Token } from '@sushiswap/currency'
import { PeriodType } from 'features'

export type Schedule = Period[]
export type Period = {
  id: string
  type: PeriodType
  date: Date
  amount: Amount<Token>
  total: Amount<Token>
}

type CreateScheduleRepresentation = (x: {
  token: Token
  cliffAmount: Amount<Token> | undefined
  stepAmount: Amount<Token>
  startDate: Date
  cliffEndDate: Date | undefined
  stepPayouts: number
  stepDuration: number
}) => Schedule

export const createScheduleRepresentation: CreateScheduleRepresentation = ({
  token,
  cliffAmount,
  stepAmount,
  stepDuration,
  startDate,
  cliffEndDate,
  stepPayouts,
}) => {
  let total = Amount.fromRawAmount(token, '0')
  const periods = [
    {
      id: 'start',
      type: PeriodType.START,
      date: startDate,
      amount: Amount.fromRawAmount(token, '0'),
      total: Amount.fromRawAmount(token, '0'),
    },
  ]

  if (cliffEndDate && cliffAmount) {
    total = cliffAmount
    periods.push({
      id: 'cliff',
      type: PeriodType.CLIFF,
      date: cliffEndDate,
      amount: cliffAmount,
      total,
    })
  }

  let time = (cliffEndDate ? cliffEndDate : startDate).getTime()
  for (let i = 0; i < stepPayouts - 1; i++) {
    time += stepDuration
    total = total.add(stepAmount)
    periods.push({
      id: `step:${i}`,
      type: PeriodType.STEP,
      date: new Date(time),
      amount: stepAmount,
      total,
    })
  }

  time += stepDuration
  total = total.add(stepAmount)
  periods.push({
    id: 'end',
    type: PeriodType.END,
    date: new Date(time),
    amount: stepAmount,
    total,
  })

  return periods
}
