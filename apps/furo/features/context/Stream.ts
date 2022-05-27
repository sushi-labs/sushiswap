import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'

import { Furo } from './Furo'
import { StreamRepresentation } from './representations'

export class Stream extends Furo {
  public constructor({ stream, chainId }: { stream: StreamRepresentation; chainId: ChainId }) {
    super({ furo: stream, chainId })
  }

  public get streamedAmount(): Amount<Token> | undefined {
    if (!this._balance) return undefined
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')
    return this._balance.add(this._withdrawnAmount)
  }

  public get streamedPercentage(): Percent | undefined {
    if (!this._balance) return undefined
    if (!this.isStarted) return new Percent(0, 100)
    return new Percent(this._withdrawnAmount.add(this._balance).quotient, this.amount.quotient)
  }
}
