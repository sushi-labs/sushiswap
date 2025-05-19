import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class KodiakV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BERA]: '0x5e705e184d233ff2a7cb1553793464a9d0c3028f',
    } as const
    const initCodeHash = {
      [ChainId.BERA]:
        '0x190cc7bdd70507a793b76d7bc2bf03e1866989ca7881812e0e1947b23e099534',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.KodiakV2
  }
  getPoolProviderName(): string {
    return 'KodiakV2'
  }
}
