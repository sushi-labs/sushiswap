import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class CroDefiSwapProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0x9DEB29c9a4c7A88a3C0257393b7f3335338D9A9D',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0x69d637e77615df9f235f642acebbdad8963ef35c5523142078c9b8f9d0ceba7e',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.CroDefiSwap
  }
  getPoolProviderName(): string {
    return 'CroDefiSwap'
  }
}
