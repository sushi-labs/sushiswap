import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Percent } from 'sushi'

import { Rebase, streamQuery } from '../.graphclient'
import { Furo } from './Furo'

export class Stream extends Furo {
  public readonly totalAmount: Amount<Token>
  public readonly initialSharesExtended: Amount<Token>
  public readonly extendedShares: Amount<Token>
  public readonly extendedAtTimestamp: Date
  public readonly withdrawnShares: Amount<Token>
  public readonly withdrawnAmountAfterExtension: Amount<Token>

  public constructor({
    chainId,
    furo,
    rebase,
  }: {
    chainId: ChainId
    furo: NonNullable<streamQuery['stream']>
    rebase: Pick<Rebase, 'id' | 'base' | 'elastic'>
  }) {
    super({ chainId, furo, rebase })
    this.totalAmount = Amount.fromShare(this.token, BigInt(furo.remainingShares), this.rebase).add(this.withdrawnAmount)
    this.initialSharesExtended = Amount.fromRawAmount(this.token, BigInt(furo.initialSharesExtended))
    this.extendedShares = Amount.fromRawAmount(this.token, BigInt(furo.extendedShares))
    this.extendedAtTimestamp = new Date(parseInt(furo.extendedAtTimestamp) * 1000)
    this.withdrawnShares = Amount.fromRawAmount(
      this.token,
      this.initialShares.quotient + this.extendedShares.quotient - this.remainingShares.quotient
    )
    this.withdrawnAmountAfterExtension = Amount.fromRawAmount(this.token, furo.withdrawnAmountAfterExtension)
  }

  public override get balance(): Amount<Token> {
    if (!this.isStarted) return this._balance
    if (this.isCancelled) return this.withdrawnAmount

    if (this.extendedShares.equalTo(0)) {
      const duration = BigInt(this.endTime.getTime()) - BigInt(this.startTime.getTime())
      const passed = BigInt(Date.now()) - BigInt(this.startTime.getTime())
      const streamedShares = (this.initialShares.quotient * passed) / duration
      const pendingAmount = Amount.fromShare(this.token, streamedShares - this.withdrawnShares.quotient, this.rebase)
      const balance = Amount.fromRawAmount(this.token, this.withdrawnAmount.quotient + pendingAmount.quotient)

      return balance.lessThan(this.totalAmount) ? balance : this.totalAmount
    } else {
      const duration = BigInt(this.endTime.getTime()) - BigInt(this.extendedAtTimestamp.getTime())
      const passed = BigInt(Date.now()) - BigInt(this.extendedAtTimestamp.getTime())
      const streamedSharesAfterExtension = (this.initialSharesExtended.quotient * passed) / duration
      const withdrawnSharesAfterExtension = this.initialSharesExtended.quotient - this.remainingShares.quotient
      const pendingAmount = Amount.fromShare(
        this.token,
        streamedSharesAfterExtension - withdrawnSharesAfterExtension,
        this.rebase
      )

      const balance = Amount.fromRawAmount(this.token, this.withdrawnAmount.quotient + pendingAmount.quotient)

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
      const duration = BigInt(this.endTime.getTime()) - BigInt(this.startTime.getTime())
      const passed = BigInt(Date.now()) - BigInt(this.startTime.getTime())
      const percent = new Percent(passed, duration)
      return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
    } else {
      const totalShares = this.initialShares.quotient + this.extendedShares.quotient
      const streamedBeforeExtension = totalShares - this.initialSharesExtended.quotient

      const duration = BigInt(this.endTime.getTime()) - BigInt(this.extendedAtTimestamp.getTime())
      const passed = BigInt(Date.now()) - BigInt(this.extendedAtTimestamp.getTime())
      const streamedSharesAfterExtension = (this.initialSharesExtended.quotient * passed) / duration

      const totalStreamed = streamedSharesAfterExtension + streamedBeforeExtension

      const percent = new Percent(totalStreamed, totalShares)
      return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
    }
  }
}
