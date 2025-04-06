import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV2BaseProvider } from './AlgebraV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class FenixProvider extends AlgebraV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x7a44CD060afC1B6F4c80A2B9b37f4473E74E25Df',
    } as const
    const poolDeployer = {
      [ChainId.BLAST]: '0x5aCCAc55f692Ae2F065CEdDF5924C8f6B53cDaa8',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0xf45e886a0794c1d80aeae5ab5befecd4f0f2b77c0cf627f7c46ec92dc1fa00e4',
    } as const
    const tickLens = {
      [ChainId.BLAST]: '0x098cB852107a0b4508664C09917c00dcb0745aa9',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Fenix
  }
  getPoolProviderName(): string {
    return 'Fenix'
  }
}
