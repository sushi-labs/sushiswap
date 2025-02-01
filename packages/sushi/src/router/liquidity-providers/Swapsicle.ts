import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV2BaseProvider } from './AlgebraV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SwapsicleProvider extends AlgebraV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.TELOS]: '0xA09BAbf9A48003ae9b9333966a8Bda94d820D0d9',
    } as const
    const poolDeployer = {
      [ChainId.TELOS]: '0x061e47Ab9f31D293172efb88674782f80eCa88de',
    } as const
    const initCodeHash = {
      [ChainId.TELOS]:
        '0x177d5fbf994f4d130c008797563306f1a168dc689f81b2fa23b4396931014d91',
    } as const
    const tickLens = {
      [ChainId.TELOS]: '0x9dE2dEA5c68898eb4cb2DeaFf357DFB26255a4aa',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Swapsicle
  }
  getPoolProviderName(): string {
    return 'Swapsicle'
  }
}
