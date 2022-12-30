import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { ethers } from 'ethers'

import { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { PoolCode } from '../pools/PoolCode'

export enum LiquidityProviders {
  Sushiswap = 'Sushiswap',
  UniswapV2 = 'UniswapV2',
  Trident = 'Trident',
  Quickswap = 'Quickswap',
  NativeWrap = 'NativeWrap',
}

export abstract class LiquidityProviderMC {
  limited: Limited
  chainDataProvider: ethers.providers.BaseProvider
  multiCallProvider: MultiCallProvider
  chainId: ChainId
  stateId = 0

  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    this.limited = l
    this.chainDataProvider = chainDataProvider
    this.multiCallProvider = multiCallProvider
    this.chainId = chainId
  }

  abstract getType(): LiquidityProviders

  // The name of liquidity provider to be used for pool naming. For example, 'Sushiswap'
  abstract getPoolProviderName(): string

  // To start ferch pools data. Can fetch data for the most used or big pools even before
  // to/from tokens are known
  abstract startFetchPoolsData(): void

  // start fetching pools data for tokens t0, t1, if it is not fetched before
  // call if for to and from tokens
  abstract fetchPoolsForToken(t0: Token, t1: Token): void

  // Returns current pools data
  abstract getCurrentPoolList(): PoolCode[]

  // If pools data were changed then stateId should be increased
  getCurrentPoolStateId() {
    return this.stateId
  }

  // Stops all network activity
  abstract stopFetchPoolsData(): void
}
