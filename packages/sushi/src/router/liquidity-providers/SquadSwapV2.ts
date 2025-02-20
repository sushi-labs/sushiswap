import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class SquadSwapV2Provider extends UniswapV2BaseProvider {
  override fee = 0.002
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: '0x1D9F43a6195054313ac1aE423B1f810f593b6ac1',
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        '0xd424455c1204e4f46a4a380651928652376a351698d3d97e2da05d3041c15fbe',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SquadSwapV2
  }
  getPoolProviderName(): string {
    return 'SquadSwapV2'
  }
}
