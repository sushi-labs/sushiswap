import { ChainId } from '@sushiswap/core-sdk'

import { Furo } from './Furo'
import { StreamRepresentation } from './representations'

export class Stream extends Furo {
  public constructor({ stream, chainId }: { stream: StreamRepresentation; chainId: ChainId }) {
    super({ furo: stream, chainId })
  }
}
