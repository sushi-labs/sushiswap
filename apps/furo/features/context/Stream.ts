import { ChainId, Percent, ZERO } from '@sushiswap/core-sdk'
import { Amount, Token } from '@sushiswap/currency'
import { FuroStatus } from 'features/context/enums'

import { Furo } from './Furo'
import { StreamRepresentation } from './representations'

export class Stream extends Furo {
  public constructor({ stream, chainId }: { stream: StreamRepresentation; chainId: ChainId }) {
    super({ furo: stream, chainId })
  }

  public get streamedAmount(): Amount<Token> {
    if (!this.isStarted) return Amount.fromRawAmount(this.token, '0')

    // If balance is available calculate streamedAmount like this
    // to trigger re-renders on balance updates
    if (this._balance?.greaterThan(ZERO)) return this._balance.add(this._withdrawnAmount)

    // Otherwise, use subgraph only
    return this.amount.multiply(this.streamedPercentage)
  }

  public get streamedPercentage(): Percent {
    if (!this.isStarted) return new Percent(0, 100)
    const now = this.status === FuroStatus.CANCELLED ? this.modifiedAtTimestamp.getTime() : Date.now()
    const total = this.endTime.getTime() - this.startTime.getTime()
    const current = now - this.startTime.getTime()
    return new Percent(current, total)
  }
}
