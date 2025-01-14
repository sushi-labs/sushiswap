import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class UbeSwapProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CELO]: '0x62d5b84bE28a183aBB507E125B384122D2C25fAE',
    } as const
    const initCodeHash = {
      [ChainId.CELO]:
        '0xb3b8ff62960acea3a88039ebcf80699f15786f1b17cebd82802f7375827a339c',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UbeSwap
  }
  getPoolProviderName(): string {
    return 'UbeSwap'
  }
}
