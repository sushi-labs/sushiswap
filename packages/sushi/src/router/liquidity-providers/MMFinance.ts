import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class MMFinanceProvider extends UniswapV2BaseProvider {
  override fee = 0.0017
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CRONOS]: '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4',
    } as const
    const initCodeHash = {
      [ChainId.CRONOS]:
        '0x7ae6954210575e79ea2402d23bc6a59c4146a6e6296118aa8b99c747afec8acf',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.MMFinance
  }
  getPoolProviderName(): string {
    return 'MMFinance'
  }
}
