import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class CORExProvider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CORE]: '0x526190295AFB6b8736B14E4b42744FBd95203A3a',
    } as const
    const initCodeHash = {
      [ChainId.CORE]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.CORE]: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.COREx
  }
  getPoolProviderName(): string {
    return 'COREx'
  }
}
