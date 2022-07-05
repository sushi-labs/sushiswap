import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent } from '@sushiswap/math'

import { Furo } from './Furo'
import { type Rebase as RebaseDTO, type Stream as StreamDTO } from '.graphclient'

export class Stream extends Furo {
  public constructor({ chainId, furo, rebase }: { chainId: ChainId; furo: StreamDTO; rebase: RebaseDTO }) {
    super({ chainId, furo, rebase })
  }

  public override get balance(): Amount<Token> {
    if (!this.isStarted) return this._balance
    if (this.isCancelled) return this.withdrawnAmount

    const duration = JSBI.subtract(JSBI.BigInt(this.endTime.getTime()), JSBI.BigInt(this.startTime.getTime()))
    const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.startTime.getTime()))
    const balance = Amount.fromRawAmount(this.token, JSBI.divide(JSBI.multiply(this.amount.quotient, passed), duration))
    return balance.lessThan(this.amount) ? balance : this.amount
  }

  public get streamedAmount(): Amount<Token> | undefined {
    if (!this.isStarted) return this._balance
    return this.balance
  }

  public get streamedPercentage(): Percent | undefined {
    if (!this.isStarted) return new Percent(0, 100)
    const percent = new Percent(this.balance.quotient, this.amount.quotient)
    return percent.greaterThan(new Percent(100, 100).asFraction) ? new Percent(100, 100) : percent
  }
}
