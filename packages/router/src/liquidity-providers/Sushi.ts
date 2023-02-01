import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId) {
    const factory = FACTORY_ADDRESS as { [chainId: number]: `0x${string}` }
    super(chainId, factory, INIT_CODE_HASH)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwap
  }
  getPoolProviderName(): string {
    return 'SushiSwap'
  }
}
