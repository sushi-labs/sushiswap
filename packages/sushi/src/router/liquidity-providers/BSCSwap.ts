import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class BSCSwapProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BSC]: '0xCe8fd65646F2a2a897755A1188C04aCe94D2B8D0',
    } as const
    const initCodeHash = {
      [ChainId.BSC]:
        '0xacc1c81cc3e9fb496da555f6bd67c3a095e579b26c1b580070cc6afa8f0a94fa',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.BSCSwap
  }
  getPoolProviderName(): string {
    return 'BSCSwap'
  }
}
