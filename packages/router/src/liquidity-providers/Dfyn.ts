import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class DfynProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3',
  } as const
  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Dfyn
  }
  getPoolProviderName(): string {
    return 'Dfyn'
  }
}
