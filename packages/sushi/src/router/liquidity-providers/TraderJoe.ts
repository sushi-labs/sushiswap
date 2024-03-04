import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class TraderJoeProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.AVALANCHE]: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    } as const
    const initCodeHash = {
      [ChainId.AVALANCHE]:
        '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.TraderJoe
  }
  getPoolProviderName(): string {
    return 'TraderJoe'
  }
}
