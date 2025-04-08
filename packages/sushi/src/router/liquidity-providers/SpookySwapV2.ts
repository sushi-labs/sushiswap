import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SpookySwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FANTOM]: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    } as const
    const initCodeHash = {
      [ChainId.FANTOM]:
        '0xcdf2deca40a0bd56de8e3ce5c7df6727e5b1bf2ac96f283fa9c4b3e6b42ea9d2',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SpookySwapV2
  }
  getPoolProviderName(): string {
    return 'SpookySwapV2'
  }
}
