import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { VelodromeSlipstreamBaseProvider } from './VelodromeSlipstreamBase.js'

export class AerodromeSlipstreamProvider extends VelodromeSlipstreamBaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A',
    } as const
    const customSwapFeeModule = {
      [ChainId.BASE]: '0xF4171B0953b52Fa55462E4d76ecA1845Db69af00',
    } as const
    const poolImplementation = {
      [ChainId.BASE]: '0xeC8E5342B19977B4eF8892e02D8DAEcfa1315831',
    } as const
    const tickLens = {
      [ChainId.BASE]: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
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
    return LiquidityProviders.AerodromeSlipstream
  }
  getPoolProviderName(): string {
    return 'AerodromeSlipstream'
  }
}
