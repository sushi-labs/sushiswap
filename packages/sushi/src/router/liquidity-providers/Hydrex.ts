import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class HydrexProvider extends UniswapV2BaseProvider {
  override fee = 0.003 // TODO: Update with actual fee if different
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x36077D39cdC65E1e3FB65810430E5b2c4D5fA29E', // TODO: Replace with actual Hydrex factory address
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0xa18736c3ee97fe3c96c9428c0cc2a9116facec18e84f95f9da30543f8238a782', // TODO: Replace with actual Hydrex init code hash
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Hydrex
  }
  getPoolProviderName(): string {
    return 'Hydrex'
  }
}
