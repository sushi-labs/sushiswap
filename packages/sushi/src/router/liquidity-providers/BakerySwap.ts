import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class BakerySwapProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7',
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        '0xe2e87433120e32c4738a7d8f3271f3d872cbe16241d67537139158d90bac61d3',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.BakerySwap
  }
  getPoolProviderName(): string {
    return 'BakerySwap'
  }
}
