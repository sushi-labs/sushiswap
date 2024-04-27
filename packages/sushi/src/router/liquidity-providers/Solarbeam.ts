import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class SolarbeamProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.MOONBEAM]: '0x19B85ae92947E0725d5265fFB3389e7E4F191FDa',
    } as const
    const initCodeHash = {
      [ChainId.MOONBEAM]:
        '0x9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Solarbeam
  }
  getPoolProviderName(): string {
    return 'Solarbeam'
  }
}
