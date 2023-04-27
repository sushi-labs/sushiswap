import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient?: PrismaClient) {
    const factory = FACTORY_ADDRESS as { [chainId: number]: `0x${string}` }
    super(chainId, web3Client, factory, INIT_CODE_HASH, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwap
  }
  getPoolProviderName(): string {
    return 'SushiSwap'
  }
}
