import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SparkDexV2Provider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FLARE]: '0x16b619B04c961E8f4F06C10B42FDAbb328980A89',
    } as const
    const initCodeHash = {
      [ChainId.FLARE]:
        '0x60cc0e9ad39c5fa4ee52571f511012ed76fbaa9bbaffd2f3fafffcb3c47cff6e',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SparkDexV2
  }
  getPoolProviderName(): string {
    return 'SparkDexV2'
  }
}
