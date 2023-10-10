import { ChainId } from 'sushi/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class QuickSwapProvider extends UniswapV2BaseProvider {
  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    databaseClient?: PrismaClient,
  ) {
    const factory = {
      [ChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    } as const
    super(chainId, web3Client, factory, initCodeHash, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.QuickSwap
  }
  getPoolProviderName(): string {
    return 'QuickSwap'
  }
}
