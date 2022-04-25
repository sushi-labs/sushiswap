import { BigNumber } from 'ethers'
import { FuroStatus, VestingType } from './enums'
import { Furo } from './Furo'
import { VestingRepresentation } from './representations'

export class Vesting extends Furo {
  public readonly steps: BigNumber
  public readonly cliffAmount: BigNumber
  public readonly stepAmount: BigNumber
  public readonly cliffDuration: BigNumber
  public readonly stepDuration: BigNumber
  public readonly vestingType: VestingType

  public constructor({ vesting }: { vesting: VestingRepresentation }) {
    super({ furo: vesting })
    this.steps = BigNumber.from(vesting.steps)
    this.cliffAmount = BigNumber.from(vesting.cliffAmount)
    this.stepAmount = BigNumber.from(vesting.stepAmount)
    this.cliffDuration = BigNumber.from(vesting.cliffDuration)
    this.stepDuration =  BigNumber.from(vesting.stepDuration)
    this.stepDuration = BigNumber.from(vesting.stepDuration)
    if (!this.stepDuration.isZero() && !this.cliffDuration.isZero()) {
      this.vestingType = VestingType.HYBRID
    } else if (!this.stepDuration.isZero()) {
      this.vestingType = VestingType.GRADED
    } else if (!this.cliffDuration.isZero()) {
      this.vestingType = VestingType.CLIFF
    } else {
      this.vestingType = VestingType.IMMEDIATE
    }
  }

  // public get nextPaymentTimeRemaining(): { days: number; hours: number; minutes: number; seconds: number } | undefined {
  //   if (this.status === FuroStatus.ACTIVE || this.status === FuroStatus.UPCOMING) {
  //     const now = Date.now()
  //     let nextPayoutTime
  //     if (this.vestingType === VestingType.HYBRID) {
  //       // check if cliff has passed
  //       // TODO: refactor everything to support bignumber?
  //       const cliffTime = this.startTime.getTime() + (this.cliffDuration.toNumber() * 1000)
  //       if (now < cliffTime) {
  //         nextPayoutTime = new Date(cliffTime)
  //       } else {
  //         const passedSinceCliff = now - cliffTime
  //         const ddd = passedSinceCliff / this.stepDuration.mul(1000).toNumber()
  //         const stepPassed = this.steps.lt(ddd) ? this.steps : ddd
  //       }

  //     }
  //     const interval = this.endTime.getTime() - now

  //     let days = Math.floor(interval / (1000 * 60 * 60 * 24))
  //     let hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  //     let minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60))
  //     let seconds = Math.floor((interval % (1000 * 60)) / 1000)

  //     return { days, hours, minutes, seconds }
  //   }
  //   return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  // }

  // public get claimableAmount(): BigNumber {
  //   return
  // }
}
