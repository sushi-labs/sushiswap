import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { VelodromeSlipstreamBaseProvider } from './VelodromeSlipstreamBase.js'

export class VelodromeSlipstreamProvider extends VelodromeSlipstreamBaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.OPTIMISM]: '0xCc0bDDB707055e04e497aB22a59c2aF4391cd12F',
    } as const
    const customSwapFeeModule = {
      [ChainId.OPTIMISM]: '0x7361E9079920fb75496E9764A2665d8ee5049D5f',
    } as const
    const poolImplementation = {
      [ChainId.OPTIMISM]: '0xc28aD28853A547556780BEBF7847628501A3bCbb',
    } as const
    const tickLens = {
      [ChainId.OPTIMISM]: '0x49C6FDCb3D5b2CecD8baff66c8e94b9B261ad925',
    } as const
    super(
      chainId,
      web3Client,
      factory,
      tickLens,
      poolImplementation,
      customSwapFeeModule,
    )
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.VelodromeSlipstream
  }
  getPoolProviderName(): string {
    return 'VelodromeSlipstream'
  }
}
