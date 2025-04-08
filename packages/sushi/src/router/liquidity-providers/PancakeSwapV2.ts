import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class PancakeSwapV2Provider extends UniswapV2BaseProvider {
  override fee = 0.0025
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
      [ChainId.BSC]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
      [ChainId.POLYGON_ZKEVM]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
      [ChainId.ZKSYNC_ERA]: '0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d',
      [ChainId.ARBITRUM]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
      [ChainId.LINEA]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
      [ChainId.BASE]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
      [ChainId.BSC]:
        '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
      [ChainId.POLYGON_ZKEVM]:
        '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
      [ChainId.ZKSYNC_ERA]:
        '0x1cb011040b91cd937ddff2327f17c9690653b05b6506e830baadf2493468d657',
      [ChainId.ARBITRUM]:
        '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
      [ChainId.LINEA]:
        '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
      [ChainId.BASE]:
        '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.PancakeSwapV2
  }
  getPoolProviderName(): string {
    return 'PancakeSwapV2'
  }
}
