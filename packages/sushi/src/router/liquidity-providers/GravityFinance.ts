import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class GravityFinanceProvider extends UniswapV2BaseProvider {
  override fee = 0.0025
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: '0x3ed75AfF4094d2Aaa38FaFCa64EF1C152ec1Cf20',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        '0x59f0dd0ec2453a509915048cac1608e1a52938dbcdf6b4960b21592e7996743a',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.GravityFinance
  }
  getPoolProviderName(): string {
    return 'GravityFinance'
  }
}
