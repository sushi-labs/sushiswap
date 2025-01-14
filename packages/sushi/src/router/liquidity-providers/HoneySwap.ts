import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class HoneySwapProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.GNOSIS]: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
    } as const
    const initCodeHash = {
      [ChainId.GNOSIS]:
        '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.HoneySwap
  }
  getPoolProviderName(): string {
    return 'HoneySwap'
  }
}
