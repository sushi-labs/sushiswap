import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class RingExchangeV2Provider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x24F5Ac9A706De0cF795A8193F6AB3966B14ECfE6',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x501ce753061ab6e75837b15f074633bb775f5972f8dc1112fcc829c2e88dc689',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.RingExchangeV2
  }
  getPoolProviderName(): string {
    return 'RingExchangeV2'
  }
}
