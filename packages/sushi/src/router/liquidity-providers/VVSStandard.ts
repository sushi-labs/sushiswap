import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class VVSStandardProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CRONOS]: '0x3B44B2a187a7b3824131F8db5a74194D0a42Fc15',
    } as const
    const initCodeHash = {
      [ChainId.CRONOS]:
        '0xa77ee1cc0f39570ddde947459e293d7ebc2c30ff4e8fc45860afdcb2c2d3dc17',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.VVSStandard
  }
  getPoolProviderName(): string {
    return 'VVSStandard'
  }
}
