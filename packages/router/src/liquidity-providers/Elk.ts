import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ElkProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
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
    return LiquidityProviders.Elk
  }
  getPoolProviderName(): string {
    return 'Elk'
  }
}
