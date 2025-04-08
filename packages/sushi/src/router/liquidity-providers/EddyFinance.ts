import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class EddyFinanceProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ZETACHAIN]: '0x9fd96203f7b22bCF72d9DCb40ff98302376cE09c',
    } as const
    const initCodeHash = {
      [ChainId.ZETACHAIN]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.EddyFinance
  }
  getPoolProviderName(): string {
    return 'EddyFinance'
  }
}
