import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class BlastDEXProvider extends UniswapV2BaseProvider {
  override fee = 0.002
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x66346aac17d0e61156AC5F2A934ccF2a9BDe4c65',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x376acff9b60b853f5ccc9f1caecb8dcf722793593330ac58aac8a880a3eb8b9e',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.BlastDEX
  }
  getPoolProviderName(): string {
    return 'BlastDEX'
  }
}
