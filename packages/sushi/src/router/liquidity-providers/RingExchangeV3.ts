import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

export class RingExchangeV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x890509Fab3dD11D4Ff57d8471b5eAC74687E4C75',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.BLAST]: '0x160958266EA8fe90D3be91474BaF633eebaD17a0',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.RingExchangeV3
  }
  getPoolProviderName(): string {
    return 'RingExchangeV3'
  }
}
