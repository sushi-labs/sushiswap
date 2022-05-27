import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI, Percent } from '@sushiswap/math'

import { Furo } from './Furo'
import { StreamRepresentation } from './representations'

export class Stream extends Furo {
  public constructor({ chainId, stream }: { chainId: ChainId; stream: StreamRepresentation }) {
    super({ chainId, furo: stream })
  }

  public get balance2(): Amount<Token> {
    const duration = JSBI.subtract(JSBI.BigInt(this.endTime.getTime()), JSBI.BigInt(this.startTime.getTime()))
    const passed = JSBI.subtract(JSBI.BigInt(Date.now()), JSBI.BigInt(this.startTime.getTime()))
    return Amount.fromRawAmount(this.token, JSBI.divide(JSBI.multiply(this.amount.quotient, passed), duration))
  }

  public get streamedAmount(): Amount<Token> | undefined {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')
    return this.balance.add(this._withdrawnAmount)
  }

  public get streamedPercentage(): Percent | undefined {
    if (!this.isStarted) return new Percent(0, 100)
    return new Percent(this._withdrawnAmount.add(this.balance).quotient, this.amount.quotient)
  }
}
