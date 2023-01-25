import { ChainId } from '@sushiswap/chain'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class UniswapV2Provider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  } as const
  initCodeHash = {
    [ChainId.ETHEREUM]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  } as const
  constructor(chainId: ChainId) {
    super(chainId)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV2
  }
  getPoolProviderName(): string {
    return 'UniswapV2'
  }
}
