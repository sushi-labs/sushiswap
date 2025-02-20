import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class KwikswapProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0xdD9EFCbDf9f422e2fc159eFe77aDD3730d48056d',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0xbc919ae6f6f95dca1e223fc957286afa1da81529418e9f187db8a0b2d2e963bc',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Kwikswap
  }
  getPoolProviderName(): string {
    return 'Kwikswap'
  }
}
