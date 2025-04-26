import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class MSwapProvider extends UniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.MATCHAIN]: '0x338bCC4efd3cA000D123d7352b362Fc6D5B3D829',
    } as const
    const initCodeHash = {
      [ChainId.MATCHAIN]:
        '0x32c26bd70ba438539c5a5bf79114c634822021bef9c0ea35fe1d9842a36bd662',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.MSwap
  }
  getPoolProviderName(): string {
    return 'MSwap'
  }
}
