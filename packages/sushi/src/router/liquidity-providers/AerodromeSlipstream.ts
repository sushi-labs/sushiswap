import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { VelodromeSlipstreamBaseProvider } from '../rain/VelodromeSlipstreamBase.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class AerodromeSlipstreamProvider extends VelodromeSlipstreamBaseProvider {
  override DEFAULT_TICK_SPACINGS = [1, 50, 100, 200, 2000, 10] as any
  override tickSpacings: number[] = [...this.DEFAULT_TICK_SPACINGS]
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A',
    } as const
    const tickLens = {
      [ChainId.BASE]: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
    } as const
    super(chainId, web3Client, factory, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.AerodromeSlipstream
  }
  getPoolProviderName(): string {
    return 'AerodromeSlipstream'
  }
}
