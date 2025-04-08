import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class HyperBlastProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0xD97fFc2041a8aB8f6bc4aeE7eE8ECA485381D088',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x2e6ab686c26cf8ecf0a8c01a9fb0ef96dbd4631c04b03005350fa49e8f2f32f8',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.HyperBlast
  }
  getPoolProviderName(): string {
    return 'HyperBlast'
  }
}
