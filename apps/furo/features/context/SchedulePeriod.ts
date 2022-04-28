import { Amount, Token } from 'currency'
import { JSBI } from 'math'
import { PeriodType } from './enums'
import { PeriodRepresentation } from './representations'

export class SchedulePeriod {
  public readonly id: string
  public readonly type: PeriodType
  public readonly date: Date
  public readonly amount: Amount<Token>

  public constructor({ token, period }: { token: Token; period: PeriodRepresentation }) {
    this.id = period.id
    this.type = PeriodType[period.type]
    this.date = new Date(parseInt(period.time) * 1000)
    this.amount = Amount.fromRawAmount(token, JSBI.BigInt(period.amount))
  }
}
