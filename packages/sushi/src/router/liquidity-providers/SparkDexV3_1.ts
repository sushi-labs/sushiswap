import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SparkDexV3_1Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FLARE]: '0x8A2578d23d4C532cC9A98FaD91C0523f5efDE652',
    } as const
    const initCodeHash = {
      [ChainId.FLARE]:
        '0x209015062f691a965df159762a8d966b688e328361c53ec32da2ad31287e3b72',
    } as const
    const tickLens = {
      [ChainId.FLARE]: '0xdB5F2Ca65aAeB277E36be69553E0e7aA3585204d',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SparkDexV3_1
  }
  getPoolProviderName(): string {
    return 'SparkDexV3_1'
  }
}
