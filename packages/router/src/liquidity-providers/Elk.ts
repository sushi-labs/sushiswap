import { ChainId } from '@sushiswap/chain'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ElkProvider extends UniswapV2BaseProvider {

  constructor(chainId: ChainId) {
    const   factory = {
      [ChainId.POLYGON]: '0xE3BD06c7ac7E1CeB17BdD2E5BA83E40D1515AF2a',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]: '0x84845e7ccb283dec564acfcd3d9287a491dec6d675705545a2ab8be22ad78f31',
    } as const
    super(chainId, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Elk
  }
  getPoolProviderName(): string {
    return 'Elk'
  }
}
