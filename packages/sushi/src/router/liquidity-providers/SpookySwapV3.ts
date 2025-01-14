import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SpookySwapV3Provider extends RainUniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FANTOM]: '0x7928a2c48754501f3a8064765ECaE541daE5c3E6',
    } as const
    const initCodeHash = {
      [ChainId.FANTOM]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.FANTOM]: '0xbaA8353CC9d02733eF12f9556ed999521f6E554c',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SpookySwapV3
  }
  getPoolProviderName(): string {
    return 'SpookySwapV3'
  }
}
