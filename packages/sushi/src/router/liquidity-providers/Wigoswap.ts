import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class WigoswapProvider extends UniswapV2BaseProvider {
  override fee = 0.0019
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FANTOM]: '0xC831A5cBfb4aC2Da5ed5B194385DFD9bF5bFcBa7',
    } as const
    const initCodeHash = {
      [ChainId.FANTOM]:
        '0x55c39e9406ff3c89a193882b4752879e73c8a0ce1222fe1de34c5e8f6482d9b6',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Wigoswap
  }
  getPoolProviderName(): string {
    return 'Wigoswap'
  }
}
