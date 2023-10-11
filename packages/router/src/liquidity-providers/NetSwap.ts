import { ChainId } from 'sushi/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class NetSwapProvider extends UniswapV2BaseProvider {
  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    databaseClient?: PrismaClient,
  ) {
    const factory = {
      [ChainId.METIS]: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f',
    } as const
    const initCodeHash = {
      [ChainId.METIS]:
        '0x966d65068a6a30f10fd1fa814258637a34e059081d79daa94f3e2b6cec48e810',
    } as const
    super(chainId, web3Client, factory, initCodeHash, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.NetSwap
  }
  getPoolProviderName(): string {
    return 'NetSwap'
  }
}
