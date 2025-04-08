import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SwapBlastProvider extends UniswapV2BaseProvider {
  override fee = 0.001
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x04C9f118d21e8B767D2e50C946f0cC9F6C367300',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x89f2ba5c4e1e84307b0efac8ff56efab2786d9becd741ff83b1b6397de76dafc',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SwapBlast
  }
  getPoolProviderName(): string {
    return 'SwapBlast'
  }
}
