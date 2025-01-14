import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class BiswapProvider extends RainUniswapV2BaseProvider {
  override fee = 0.002
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: '0x858E3312ed3A876947EA49d572A7C42DE08af7EE',
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        '0xfea293c909d87cd4153593f077b76bb7e94340200f4ee84211ae8e4f9bd7ffdf',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Biswap
  }
  getPoolProviderName(): string {
    return 'Biswap'
  }
}
