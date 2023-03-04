import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class JetSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0x505c843b83f01afef714149e8b174427d552e1aca4834b4f9b4b525f426ff3c6',
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
    return LiquidityProviders.JetSwap
  }
  getPoolProviderName(): string {
    return 'JetSwap'
  }
}
