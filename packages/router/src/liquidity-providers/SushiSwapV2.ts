import { ChainId } from 'sushi/chain'
import { PrismaClient } from '@sushiswap/database'
import { SUSHISWAP_V2_FACTORY_ADDRESS, SUSHISWAP_V2_INIT_CODE_HASH } from '@sushiswap/v2-sdk'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiSwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient?: PrismaClient) {
    const factory = SUSHISWAP_V2_FACTORY_ADDRESS as { [chainId: number]: `0x${string}` }
    super(chainId, web3Client, factory, SUSHISWAP_V2_INIT_CODE_HASH, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV2
  }
  getPoolProviderName(): string {
    return 'SushiSwapV2'
  }
}
