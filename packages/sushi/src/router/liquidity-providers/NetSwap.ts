import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class NetSwapProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.METIS]: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f',
    } as const
    const initCodeHash = {
      [ChainId.METIS]:
        '0x966d65068a6a30f10fd1fa814258637a34e059081d79daa94f3e2b6cec48e810',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.NetSwap
  }
  getPoolProviderName(): string {
    return 'NetSwap'
  }
}
