import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SolarbeamProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.MOONRIVER]: '0x049581aEB6Fe262727f290165C29BDAB065a1B68',
      [ChainId.MOONBEAM]: '0x19B85ae92947E0725d5265fFB3389e7E4F191FDa',
    } as const
    const initCodeHash = {
      [ChainId.MOONRIVER]:
        '0x9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf',
      [ChainId.MOONBEAM]:
        '0xe21386787732ef8059a646602f85a5ebb23848cddd90ef5a8d111ec84a4cb71f',
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
