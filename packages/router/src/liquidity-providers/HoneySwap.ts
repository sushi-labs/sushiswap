import { ChainId } from '@sushiswap/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class HoneySwapProvider extends UniswapV2BaseProvider {

  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient: PrismaClient) {
    const factory = {
      [ChainId.GNOSIS]: '0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7',
    } as const
    const initCodeHash = {
      [ChainId.GNOSIS]: '0x3f88503e8580ab941773b59034fb4b2a63e86dbc031b3633a925533ad3ed2b93',
    } as const
    super(chainId, web3Client, databaseClient, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.HoneySwap
  }
  getPoolProviderName(): string {
    return 'HoneySwap'
  }
}
