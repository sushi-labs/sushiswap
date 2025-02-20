import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV2BaseProvider } from './AlgebraV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class GlyphV4Provider extends AlgebraV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CORE]: '0x74EfE55beA4988e7D92D03EFd8ddB8BF8b7bD597',
    } as const
    const poolDeployer = {
      [ChainId.CORE]: '0x24196b3f35E1B8313016b9f6641D605dCf48A76a',
    } as const
    const initCodeHash = {
      [ChainId.CORE]:
        '0xf96d2474815c32e070cd63233f06af5413efc5dcb430aee4ff18cc29007c562d',
    } as const
    const tickLens = {
      [ChainId.CORE]: '0x433cef5888C701831360686e54668376330cED6D',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.GlyphV4
  }
  getPoolProviderName(): string {
    return 'GlyphV4'
  }
}
