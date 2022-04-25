import { JSBI } from 'math'
import { FuroStatus, VestingType } from './enums'
import { Furo } from './Furo'
import { VestingRepresentation } from './representations'

export class Vesting extends Furo {
  public readonly steps: number
  public readonly cliffAmount: JSBI
  public readonly stepAmount: JSBI
  public readonly cliffDuration: number
  public readonly stepDuration: number
  public readonly vestingType: VestingType

  public constructor({ vesting }: { vesting: VestingRepresentation }) {
    super({ furo: vesting })
    this.steps = parseInt(vesting.steps)
    this.cliffAmount = JSBI.BigInt(vesting.cliffAmount)
    this.stepAmount = JSBI.BigInt(vesting.stepAmount)
    this.cliffDuration = parseInt(vesting.cliffDuration)
    this.stepDuration = parseInt(vesting.stepDuration)
    if (this.stepDuration && this.cliffDuration) {
      this.vestingType = VestingType.HYBRID
    } else if (this.stepDuration) {
      this.vestingType = VestingType.GRADED
    } else if (this.cliffDuration) {
      this.vestingType = VestingType.CLIFF
    } else {
      this.vestingType = VestingType.IMMEDIATE
    }
  }

  public get nextPaymentTimeRemaining(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
    if (this.status === FuroStatus.ACTIVE || this.status === FuroStatus.UPCOMING) {
      const now = Date.now()
      let interval: number

      if (this.vestingType === VestingType.GRADED) {
        if (this.status === FuroStatus.UPCOMING) {
          interval = this.startTime.getTime() - now + this.stepDuration * 1000
        } else {
          const totalDuration = this.endTime.getTime() - now
          interval = totalDuration % (this.stepDuration * 1000)
        }
      } else if (this.vestingType === VestingType.CLIFF) {
        if (this.status === FuroStatus.UPCOMING) {
          interval = now + this.cliffDuration * 1000
        } else {
          interval = this.startTime.getTime() + this.cliffDuration * 1000 - now
        }
        // TODO: add hybrid
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      let days = Math.floor(interval / (1000 * 60 * 60 * 24))
      let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((interval % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

}
