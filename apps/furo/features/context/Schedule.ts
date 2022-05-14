import { Token } from '@sushiswap/currency'

import { ScheduleRepresentation } from './representations'
import { SchedulePeriod } from './SchedulePeriod'

export class Schedule {
  public readonly periods: SchedulePeriod[]

  public constructor({ token, schedule }: { token: Token; schedule: ScheduleRepresentation }) {
    this.periods = schedule?.periods.map((period) => new SchedulePeriod({ token, period }))
  }
}
