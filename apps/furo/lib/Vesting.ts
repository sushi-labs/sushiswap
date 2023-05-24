import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, minimum, Percent } from '@sushiswap/math'

import { type Vesting as VestingDTO, Rebase } from '../.graphclient'
import { VestingType } from './enums'
import { Furo } from './Furo'

export class Vesting extends Furo {
  public readonly steps: number
  public readonly cliffShares: Amount<Token>
  public readonly cliffAmount: Amount<Token>
  public readonly stepShares: Amount<Token>
  public readonly stepAmount: Amount<Token>
  public readonly totalAmount: Amount<Token>
  public readonly cliffDuration: number
  public readonly stepDuration: number
  public readonly vestingType: VestingType

  public constructor({ chainId, furo: vesting, rebase }: { chainId: ChainId; furo: VestingDTO; rebase: Rebase }) {
    super({ chainId, furo: vesting, rebase })
    this.steps = parseInt(vesting.steps)
    this.cliffShares = Amount.fromRawAmount(this.token, JSBI.BigInt(vesting.cliffShares))
    this.cliffAmount = Amount.fromShare(this.token, JSBI.BigInt(vesting.cliffShares), this.rebase)
    this.stepShares = Amount.fromRawAmount(this.token, JSBI.BigInt(vesting.stepShares))
    this.stepAmount = Amount.fromShare(this.token, JSBI.BigInt(vesting.stepShares), this.rebase)
    this.totalAmount = Amount.fromRawAmount(
      this.token,
      JSBI.add(JSBI.BigInt(this._remainingAmount.quotient), JSBI.BigInt(vesting.withdrawnAmount))
    )
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

  public get balance(): Amount<Token> {
    const timeAfterCliff = JSBI.add(JSBI.BigInt(this.startTime.getTime()), JSBI.BigInt(this.cliffDuration))

    const now = JSBI.BigInt(Date.now())

    if (JSBI.lessThan(now, timeAfterCliff)) {
      return Amount.fromRawAmount(this.token, 0)
    }

    const passedSinceCliff = JSBI.subtract(now, timeAfterCliff)

    const stepPassed = minimum(JSBI.BigInt(this.steps), JSBI.divide(passedSinceCliff, JSBI.BigInt(this.stepDuration)))

    return Amount.fromRawAmount(
      this.token,
      JSBI.subtract(
        JSBI.add(this.cliffAmount.quotient, JSBI.multiply(this.stepAmount.quotient, stepPassed)),
        this.remainingAmount.quotient
      )
    )
  }

  public get streamedAmount(): Amount<Token> {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')

    let sum = Amount.fromRawAmount(this.token, '0')
    if (this.cliffDuration) {
      if (Date.now() > this.startTime.getTime() + this.cliffDuration * 1000) {
        sum = sum.add(this.cliffAmount)

        const payouts = Math.min(
          Math.floor((Date.now() - this.startTime.getTime() - this.cliffDuration * 1000) / (this.stepDuration * 1000)),
          this.steps
        )
        sum = sum.add(this.stepAmount.multiply(payouts))
      }
    } else {
      const payouts = Math.floor((Date.now() - this.startTime.getTime()) / (this.stepDuration * 1000))
      sum = sum.add(this.stepAmount.multiply(payouts))
    }

    return sum
  }

  public get streamedShares(): Amount<Token> {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')

    let sum = Amount.fromRawAmount(this.token, '0')
    if (this.cliffDuration) {
      if (Date.now() > this.startTime.getTime() + this.cliffDuration * 1000) {
        sum = sum.add(this.cliffShares)

        const payouts = Math.min(
          Math.floor((Date.now() - this.startTime.getTime() - this.cliffDuration * 1000) / (this.stepDuration * 1000)),
          this.steps
        )
        sum = sum.add(this.stepShares.multiply(payouts))
      }
    } else {
      const payouts = Math.floor((Date.now() - this.startTime.getTime()) / (this.stepDuration * 1000))
      sum = sum.add(this.stepAmount.multiply(payouts))
    }

    return sum
  }

  public get withdrawnPercentage(): Percent {
    if (this._withdrawnAmount.toExact() === '0') return new Percent(0, 100)
    return new Percent(this._withdrawnAmount.quotient, this.totalAmount.quotient)
  }

  public get streamedPercentage(): Percent {
    if (!this.isStarted) return new Percent(0, 100)

    const percent = new Percent(this.streamedShares.quotient, this.initialShares.quotient)
    return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
  }
}
