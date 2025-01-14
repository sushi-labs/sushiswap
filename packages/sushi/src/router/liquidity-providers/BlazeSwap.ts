import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class BlazeSwapProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FLARE]: '0x440602f459D7Dd500a74528003e6A20A46d6e2A6',
    } as const
    const initCodeHash = {
      [ChainId.FLARE]:
        '0xbf4c1c435583a2bb8d763765a34a46e376071c3b3d80e5bbac0950aeecdf31cb',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.BlazeSwap
  }
  getPoolProviderName(): string {
    return 'BlazeSwap'
  }
}
