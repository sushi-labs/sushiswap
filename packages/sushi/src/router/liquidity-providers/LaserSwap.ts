import { Address, PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class LaserSwapV2Provider extends UniswapV2BaseProvider {
  override fee = 0.0025
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.THUNDERCORE]:
        '0x23c7FA9A9f81B322684F25b8079e22C37e00b46b' as Address,
    }
    const initCodeHash = {
      [ChainId.THUNDERCORE]:
        '0x9d026965f89efe44dcdcb857289f65e798b9012bfc276b63ec2a4d9f7761e8a7' as Address,
    }
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.LaserSwap
  }
  getPoolProviderName(): string {
    return 'LaserSwap'
  }
}
