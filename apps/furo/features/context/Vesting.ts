import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent } from '@sushiswap/math'

import { FuroStatus, VestingType } from './enums'
import { Furo } from './Furo'
import { VestingRepresentation } from './representations'

export class Vesting extends Furo {
  public readonly steps: number
  public readonly cliffAmount: Amount<Token>
  public readonly stepAmount: Amount<Token>
  public readonly cliffDuration: number
  public readonly stepDuration: number
  public readonly vestingType: VestingType

  public constructor({ vesting, chainId }: { vesting: VestingRepresentation; chainId: ChainId }) {
    super({ furo: vesting, chainId })
    this.steps = parseInt(vesting.steps)
    this.cliffAmount = Amount.fromRawAmount(this.token, JSBI.BigInt(vesting.cliffAmount))
    this.stepAmount = Amount.fromRawAmount(this.token, JSBI.BigInt(vesting.stepAmount))
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
      } else if (this.vestingType === VestingType.HYBRID) {
        if (this.status === FuroStatus.UPCOMING) {
          interval = this.startTime.getTime() - now + this.cliffDuration * 1000
        } else {
          const cliffTime = this.startTime.getTime() + this.cliffDuration * 1000
          if (now <= cliffTime) {
            interval = this.startTime.getTime() + this.cliffDuration * 1000 - now
          } else {
            const totalDuration = this.endTime.getTime() - this.cliffDuration * 1000 - now
            interval = totalDuration % (this.stepDuration * 1000)
          }
        }
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

  public get streamedAmount(): Amount<Token> {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')

    let sum = Amount.fromRawAmount(this.token, '0')
    if (this.cliffDuration && Date.now() > this.startTime.getTime() + this.cliffDuration * 1000) {
      sum = sum.add(this.cliffAmount)

      const payouts = Math.floor(
        (Date.now() - this.startTime.getTime() + this.cliffDuration * 1000) / (this.stepDuration * 1000)
      )
      sum = sum.add(this.stepAmount.multiply(payouts))
    } else {
      const payouts = Math.floor((Date.now() - this.startTime.getTime()) / (this.stepDuration * 1000))
      sum = sum.add(this.stepAmount.multiply(payouts))
    }

    return sum
  }

  public get streamedPercentage(): Percent {
    if (!this.isStarted) return new Percent(0, 100)
    return new Percent(this.streamedAmount.quotient, this.amount.quotient)
  }
}
