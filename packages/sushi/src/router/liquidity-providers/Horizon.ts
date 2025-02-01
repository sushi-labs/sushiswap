import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV1BaseProvider } from './AlgebraV1Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class HorizonProvider extends AlgebraV1BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.LINEA]: '0xec4f2937e57a6F39087187816eCc83191E6dB1aB',
    } as const
    const poolDeployer = {
      [ChainId.LINEA]: '0xA76990a229961280200165c4e08c96Ea67304C3e',
    } as const
    const initCodeHash = {
      [ChainId.LINEA]:
        '0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d',
    } as const
    const tickLens = {
      [ChainId.LINEA]: '0x8A3E7cc11E7B9A530b167cE4E0B921bD2610A888',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Horizon
  }
  getPoolProviderName(): string {
    return 'Horizon'
  }
}
