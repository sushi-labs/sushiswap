import { ChainId } from '@sushiswap/chain'
import { PrismaClient } from '@sushiswap/database'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV3BaseProvider } from './UniswapV3Base'

export class SushiSwapV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient?: PrismaClient) {
    const factory = {
      [ChainId.FANTOM]: '0x7770978eED668a3ba661d51a773d3a992Fc9DDCB',
      [ChainId.OPTIMISM]: '0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0',
      [ChainId.POLYGON]: '0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2',
      [ChainId.ARBITRUM_NOVA]: '0xaa26771d497814E81D305c511Efbb3ceD90BF5bd',
    } as const
    const initCodeHash = {
      [ChainId.FANTOM]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.OPTIMISM]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.POLYGON]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.ARBITRUM_NOVA]: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const

    const tickLens = {
      [ChainId.FANTOM]: '0xD75F5369724b513b497101fb15211160c1d96550',
      [ChainId.OPTIMISM]: '0x0367a647A68f304f2A6e453c25033a4249d7F2C6',
      [ChainId.POLYGON]: '0x9fdeA1412e50D78B25aCE4f96d35801647Fdf7dA',
      [ChainId.ARBITRUM_NOVA]: '0xF60e5f4A44a510742457D8064ffd360B12d8D9AF',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, databaseClient)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV3
  }
  getPoolProviderName(): string {
    return 'SushiSwapV3'
  }
}
