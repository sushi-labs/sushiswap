import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class QuickSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
  } as const
  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.QuickSwap
  }
  getPoolProviderName(): string {
    return 'QuickSwap'
  }
}
