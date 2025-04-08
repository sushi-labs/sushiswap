import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SparkDexV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FLARE]: '0xb3fB4f96175f6f9D716c17744e5A6d4BA9da8176',
    } as const
    const initCodeHash = {
      [ChainId.FLARE]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.FLARE]: '0x80BE099457DF46e7EA0C38A7B4bB8DAF74079957',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SparkDexV3
  }
  getPoolProviderName(): string {
    return 'SparkDexV3'
  }
}
