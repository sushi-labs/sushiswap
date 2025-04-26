import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class KinetixV2Provider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.KAVA]: '0xE8E917BC80A26CDacc9aA42C0F4965d2E1Fa52da',
    } as const
    const initCodeHash = {
      [ChainId.KAVA]:
        '0x4b61b80b5bcfca0f9202f2aba1955b0cfda155e379cb36e0ab38598337c4c79a',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.KinetixV2
  }
  getPoolProviderName(): string {
    return 'KinetixV2'
  }
}
