import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV1BaseProvider } from './AlgebraV1Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class KimV4Provider extends AlgebraV1BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x2F0d41f94d5D1550b79A83D2fe85C82d68c5a3ca',
    } as const
    const poolDeployer = {
      [ChainId.BASE]: '0x872f5746B3D8CC46A876cBa2269813733A56eB1D',
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d',
    } as const
    const tickLens = {
      [ChainId.BASE]: '0x44a6d9741cDF9C955eE89C14C739FB1aeaD82d6B',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.KimV4
  }
  getPoolProviderName(): string {
    return 'KimV4'
  }
}
