import { BigNumber } from 'ethers'
import { PeriodType } from './enums'
import { PeriodRepresentation } from './representations'

export class SchedulePeriod {
  public readonly type: PeriodType
  public readonly date: Date
  public readonly amount: BigNumber

  public constructor({ period }: { period: PeriodRepresentation }) {
    this.type = PeriodType[period.type]
    this.date =  new Date(parseInt(period.time) * 1000)
    this.amount = BigNumber.from(period.amount)
  }
}
