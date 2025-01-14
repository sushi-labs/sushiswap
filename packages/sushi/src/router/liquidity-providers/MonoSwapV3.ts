import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class MonoswapV3Provider extends RainUniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x48d0F09710794313f33619c95147F34458BF7C3b',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x7ea070216c7d9135010a36147394687bab92df4695e924000eed7c4b33eb922f',
    } as const
    const tickLens = {
      [ChainId.BLAST]: '0x4a3930837f6E721A6Da5DE4E400A7e90f907fb54',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.MonoswapV3
  }
  getPoolProviderName(): string {
    return 'MonoswapV3'
  }
}
