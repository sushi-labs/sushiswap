import { BigNumber } from 'ethers'
import { ScheduleRepresentation } from './representations'
import { SchedulePeriod } from './SchedulePeriod'

export class Schedule {
  public readonly steps: BigNumber
  public readonly periods: SchedulePeriod[]

  public constructor({ schedule }: { schedule: ScheduleRepresentation }) {
    this.periods = schedule?.periods.map((period) => new SchedulePeriod({ period }))
  }


}
