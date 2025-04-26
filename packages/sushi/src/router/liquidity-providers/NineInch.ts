import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class NineInchProvider extends UniswapV2BaseProvider {
  override fee = 0.0029
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0xcBAE5C3f8259181EB7E2309BC4c72fDF02dD56D8',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0xd2cf61d4acad30e9fe5ec59d0f94de554d88701f1bd8fc635546866716718511',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.NineInch
  }
  getPoolProviderName(): string {
    return 'NineInch'
  }
}
