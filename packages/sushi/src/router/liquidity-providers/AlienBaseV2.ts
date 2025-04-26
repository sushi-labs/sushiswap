import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class AlienBaseV2Provider extends UniswapV2BaseProvider {
  override fee = 0.0016
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x3E84D913803b02A4a7f027165E8cA42C14C0FdE7',
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0x7ede5bbb7d245103c4a6d59bfd62246fbc488e93f95f23a19d9d76f0d91bd0d0',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.AlienBaseV2
  }
  getPoolProviderName(): string {
    return 'AlienBaseV2'
  }
}
