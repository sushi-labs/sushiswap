import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV1BaseProvider } from './AlgebraV1Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class BladeSwapProvider extends AlgebraV1BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0xA87DbF5082Af26c9A6Ab2B854E378f704638CCa5',
    } as const
    const poolDeployer = {
      [ChainId.BLAST]: '0xfFeEcb1fe0EAaEFeE69d122F6B7a0368637cb593',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0xa9df2657ce5872e94bdc9525588fd983b0aa5db2f3c7a83d7e6b6a99cd2003a1',
    } as const
    const tickLens = {
      [ChainId.BLAST]: '0x969195B66f95D8B70fA414671b438134889Ba348',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.BladeSwap
  }
  getPoolProviderName(): string {
    return 'BladeSwap'
  }
}
