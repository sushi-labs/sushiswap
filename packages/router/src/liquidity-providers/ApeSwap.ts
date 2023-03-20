import { ChainId } from '@sushiswap/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ApeSwapProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient: PrismaClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0xBAe5dc9B19004883d0377419FeF3c2C8832d7d7B',
      [ChainId.POLYGON]: '0xCf083Be4164828f00cAE704EC15a36D711491284',
      [ChainId.BSC]: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6',
      [ChainId.TELOS]: '0x411172Dfcd5f68307656A1ff35520841C2F7fAec',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]: '0xe2200989b6f9506f3beca7e9c844741b3ad1a88ad978b6b0973e96d3ca4707aa',
      [ChainId.POLYGON]: '0x511f0f358fe530cda0859ec20becf391718fdf5a329be02f4c95361f3d6a42d8',
      [ChainId.BSC]: '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b',
      [ChainId.TELOS]: '0x7d4b9bb0d5808344c0184aada7d10aae8f6b0cc8ceb5eba8dd084f63b8c32099',
    } as const
    super(chainId, web3Client, databaseClient, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ApeSwap
  }
  getPoolProviderName(): string {
    return 'ApeSwap'
  }
}
