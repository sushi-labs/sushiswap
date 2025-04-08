import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import {
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_INIT_CODE_HASH,
} from '../../config/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class SushiSwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = SUSHISWAP_V2_FACTORY_ADDRESS
    super(chainId, web3Client, factory, SUSHISWAP_V2_INIT_CODE_HASH)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV2
  }
  getPoolProviderName(): string {
    return 'SushiSwapV2'
  }
}
