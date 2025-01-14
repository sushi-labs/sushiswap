import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SolarbeamProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.MOONRIVER]: '0x049581aEB6Fe262727f290165C29BDAB065a1B68',
      // [ChainId.MOONBEAM]: '0x19B85ae92947E0725d5265fFB3389e7E4F191FDa',
    } as const
    const initCodeHash = {
      [ChainId.MOONRIVER]:
        '0x9a100ded5f254443fbd264cb7e87831e398a8b642e061670a9bc35ba27293dbf',
      // [ChainId.MOONBEAM]:
      //   '0x36b89359c46a8b622814170939bcaa0d3c05c32c3ad83cac4d4217e1a0edf5fa',
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
