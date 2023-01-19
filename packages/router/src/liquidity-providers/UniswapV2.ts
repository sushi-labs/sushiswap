import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class UniswapV2Provider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  } as const
  initCodeHash = {
    [ChainId.ETHEREUM]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
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
    return LiquidityProviders.UniswapV2
  }
  getPoolProviderName(): string {
    return 'Uniswap V2'
  }
}
