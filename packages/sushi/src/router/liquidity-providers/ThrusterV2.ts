import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class ThrusterV2_3Provider extends RainUniswapV2BaseProvider {
  override fee = 0.003
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0xb4A7D971D0ADea1c73198C97d7ab3f9CE4aaFA13',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x6f0346418750a1a53597a51ceff4f294b5f0e87f09715525b519d38ad3fab2cb',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ThrusterV2
  }
  getPoolProviderName(): string {
    return 'ThrusterV2'
  }
}

export class ThrusterV2_1Provider extends RainUniswapV2BaseProvider {
  override fee = 0.01
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0x37836821a2c03c171fB1a595767f4a16e2b93Fc4',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0x32a9ff5a51b653cbafe88e38c4da86b859135750d3ca435f0ce732c8e3bb8335',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ThrusterV2
  }
  getPoolProviderName(): string {
    return 'ThrusterV2'
  }
}
