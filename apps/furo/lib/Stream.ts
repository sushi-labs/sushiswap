import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent } from '@sushiswap/math'

import { type Rebase as RebaseDTO, type Stream as StreamDTO } from '../.graphclient'
import { Furo } from './Furo'

export class Stream extends Furo {
  public readonly totalAmount: Amount<Token>
  public readonly initialSharesExtended: Amount<Token>
  public readonly extendedShares: Amount<Token>
  public readonly extendedAtTimestamp: Date
  public readonly withdrawnShares: Amount<Token>
  public readonly withdrawnAmountAfterExtension: Amount<Token>

  public constructor({ chainId, furo, rebase }: { chainId: ChainId; furo: StreamDTO; rebase: RebaseDTO }) {
    super({ chainId, furo, rebase })
    this.totalAmount = Amount.fromShare(this.token, JSBI.BigInt(furo.remainingShares), this.rebase).add(
      this.withdrawnAmount
    )
    this.initialSharesExtended = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.initialSharesExtended))
    this.extendedShares = Amount.fromRawAmount(this.token, JSBI.BigInt(furo.extendedShares))
    this.extendedAtTimestamp = new Date(parseInt(furo.extendedAtTimestamp) * 1000)
    this.withdrawnShares = Amount.fromRawAmount(
      this.token,
      JSBI.subtract(JSBI.add(this.initialShares.quotient, this.extendedShares.quotient), this.remainingShares.quotient)
    )
    this.withdrawnAmountAfterExtension = Amount.fromRawAmount(this.token, furo.withdrawnAmountAfterExtension)
  }

  public override get balance(): Amount<Token> {
    if (!this.isStarted) return this._balance
    if (this.isCancelled) return this.withdrawnAmount

    if (this.extendedShares.equalTo(0)) {
      const duration = JSBI.subtract(JSBI.BigInt(this.endTime.getTime()), JSBI.BigInt(this.startTime.getTime()))
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.startTime.getTime()))
      const streamedShares = JSBI.divide(JSBI.multiply(this.initialShares.quotient, passed), duration)
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
      const streamedSharesAfterExtension = JSBI.divide(
        JSBI.multiply(this.initialSharesExtended.quotient, passed),
        duration
      )
      const withdrawnSharesAfterExtension = JSBI.subtract(
        this.initialSharesExtended.quotient,
        this.remainingShares.quotient
      )
      const pendingAmount = Amount.fromShare(
        this.token,
        JSBI.subtract(streamedSharesAfterExtension, withdrawnSharesAfterExtension),
        this.rebase
      )

      const balance = Amount.fromRawAmount(this.token, JSBI.add(this.withdrawnAmount.quotient, pendingAmount.quotient))

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
      const totalShares = JSBI.add(this.initialShares.quotient, this.extendedShares.quotient)
      const streamedBeforeExtension = JSBI.subtract(totalShares, this.initialSharesExtended.quotient)

      const duration = JSBI.subtract(
        JSBI.BigInt(this.endTime.getTime()),
        JSBI.BigInt(this.extendedAtTimestamp.getTime())
      )
      const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.extendedAtTimestamp.getTime()))
      const streamedSharesAfterExtension = JSBI.divide(
        JSBI.multiply(this.initialSharesExtended.quotient, passed),
        duration
      )

      const totalStreamed = JSBI.add(streamedSharesAfterExtension, streamedBeforeExtension)

      const percent = new Percent(totalStreamed, totalShares)
      return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
    }
  }

  public get withdrawnPercentage(): Percent {
    if (this._withdrawnAmount.toExact() === '0') return new Percent(0, 100)
    return new Percent(this._withdrawnAmount.quotient, this.totalAmount.quotient)
  }
}
