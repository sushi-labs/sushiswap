import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class KinetixV3Provider extends UniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.KAVA]: '0x2dBB6254231C5569B6A4313c6C1F5Fe1340b35C2',
    } as const
    const initCodeHash = {
      [ChainId.KAVA]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.KAVA]: '0xdc7A5276aB4C6cd25e16b6118B230109945D2426',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.KinetixV3
  }
  getPoolProviderName(): string {
    return 'KinetixV3'
  }
}
