import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiProvider extends UniswapV2BaseProvider {
  factory = FACTORY_ADDRESS
  initCodeHash = INIT_CODE_HASH
  constructor(chainId: ChainId) {
    super(chainId)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwap
  }
  getPoolProviderName(): string {
    return 'SushiSwap'
  }
}
