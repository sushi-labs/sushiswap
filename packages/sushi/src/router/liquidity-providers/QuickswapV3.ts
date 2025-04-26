import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV1BaseProvider } from '../rain/AlgebraV1Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class QuickSwapV3Provider extends AlgebraV1BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28',
      [ChainId.POLYGON_ZKEVM]: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
    } as const
    const poolDeployer = {
      [ChainId.POLYGON]: '0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92',
      [ChainId.POLYGON_ZKEVM]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        '0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4',
      [ChainId.POLYGON_ZKEVM]:
        '0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4',
    } as const
    const tickLens = {
      [ChainId.POLYGON]: '0x5e9793f398c68A55F9C85A965CdB0d0c9a094d70',
      [ChainId.POLYGON_ZKEVM]: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.QuickSwapV3
  }
  getPoolProviderName(): string {
    return 'QuickswapV3'
  }
}
