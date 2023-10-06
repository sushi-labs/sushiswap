import { ChainId } from 'sushi/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class UbeSwapProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient?: PrismaClient) {
    const factory = {
      [ChainId.CELO]: '0x62d5b84bE28a183aBB507E125B384122D2C25fAE',
    } as const
    const initCodeHash = {
      [ChainId.CELO]: '0xb3b8ff62960acea3a88039ebcf80699f15786f1b17cebd82802f7375827a339c',
    } as const
    super(chainId, web3Client, factory, initCodeHash, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UbeSwap
  }
  getPoolProviderName(): string {
    return 'UbeSwap'
  }
}
