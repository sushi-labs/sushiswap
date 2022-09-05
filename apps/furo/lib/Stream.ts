import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent } from '@sushiswap/math'

import { Furo } from './Furo'
import { type Rebase as RebaseDTO, type Stream as StreamDTO } from '.graphclient'

export class Stream extends Furo {
  public readonly totalAmount: Amount<Token>
  public readonly inititalShares: Amount<Token>
  public readonly inititalAmount: Amount<Token>
  public readonly extendedShares: Amount<Token>
  public readonly extendedAtTimestamp: Date
  public readonly withdrawnShares: Amount<Token>

  public constructor({ chainId, furo, rebase }: { chainId: ChainId; furo: StreamDTO; rebase: RebaseDTO }) {
    super({ chainId, furo, rebase })
    this.totalAmount = Amount.fromShare(this.token, JSBI.BigInt(furo.remainingShares), this.rebase).add(
      this.withdrawnAmount
    )
    this.inititalShares = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.initialShares))
    this.inititalAmount = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.initialAmount))
    this.extendedShares = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.extendedShares))
    this.extendedAtTimestamp = new Date(parseInt(furo.extendedAtTimestamp) * 1000)
    this.withdrawnShares = Amount.fromRawAmount(
      this.token,
      JSBI.subtract(JSBI.add(this.inititalShares.quotient, this.extendedShares.quotient), this.remainingShares.quotient)
    )
  }

  public override get balance(): Amount<Token> {
    if (!this.isStarted) return this._balance
    if (this.isCancelled) return this.withdrawnAmount

    if (this.extendedShares.equalTo(0)) {
      const duration = JSBI.subtract(JSBI.BigInt(this.endTime.getTime()), JSBI.BigInt(this.startTime.getTime()))
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.startTime.getTime()))
      const streamedShares = JSBI.divide(JSBI.multiply(this.inititalShares.quotient, passed), duration)
      const pendingAmount = Amount.fromShare(
        this.token,
        JSBI.subtract(streamedShares, this.withdrawnShares.quotient),
        this.rebase
      )
      const balance = Amount.fromRawAmount(this.token, JSBI.add(this.withdrawnAmount.quotient, pendingAmount.quotient))

      return balance.lessThan(this.totalAmount) ? balance : this.totalAmount
    } else {
      const duration = JSBI.subtract(
        JSBI.BigInt(this.endTime.getTime()),
        JSBI.BigInt(this.extendedAtTimestamp.getTime())
      )
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.extendedAtTimestamp.getTime()))
      const balance = Amount.fromRawAmount(
        this.token,
        JSBI.divide(JSBI.multiply(this.remainingAmount.quotient, passed), duration)
      ).add(this.withdrawnAmount)

      return balance.lessThan(this.totalAmount) ? balance : this.totalAmount
    }
  }

  public get streamedAmount(): Amount<Token> | undefined {
    if (!this.isStarted) return this._balance
    return this.balance
  }

  public get streamedPercentage(): Percent | undefined {
    if (!this.isStarted) return new Percent(0, 100)

    if (this.extendedShares.equalTo(0)) {
      const duration = JSBI.subtract(JSBI.BigInt(this.endTime.getTime()), JSBI.BigInt(this.startTime.getTime()))
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.startTime.getTime()))
      const percent = new Percent(passed, duration)
      return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
    } else {
      const duration = JSBI.subtract(
        JSBI.BigInt(this.endTime.getTime()),
        JSBI.BigInt(this.extendedAtTimestamp.getTime())
      )
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.extendedAtTimestamp.getTime()))
      const balance = Amount.fromRawAmount(
        this.token,
        JSBI.divide(JSBI.multiply(this.remainingAmount.quotient, passed), duration)
      ).add(this.withdrawnAmount)
      const percent = new Percent(balance.quotient, this.totalAmount.quotient)
      return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
    }
  }

  public get withdrawnPercentage(): Percent {
    if (this._withdrawnAmount.toExact() === '0') return new Percent(0, 100)
    return new Percent(this._withdrawnAmount.quotient, this.totalAmount.quotient)
  }
}
