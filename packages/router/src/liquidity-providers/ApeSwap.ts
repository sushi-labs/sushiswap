import { ChainId } from '@sushiswap/chain'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class ApeSwapProvider extends UniswapV2BaseProvider {
  factory = {
    [ChainId.POLYGON]: '0xCf083Be4164828f00cAE704EC15a36D711491284',
    [ChainId.BSC]: '0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6',
  } as const
  initCodeHash = {
    [ChainId.POLYGON]: '0x511f0f358fe530cda0859ec20becf391718fdf5a329be02f4c95361f3d6a42d8',
    [ChainId.BSC]: '0xf4ccce374816856d11f00e4069e7cada164065686fbef53c6167a63ec2fd8c5b ',
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
    return LiquidityProviders.ApeSwap
  }
  getPoolProviderName(): string {
    return 'ApeSwap'
  }
}
