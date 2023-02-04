import type { ChainId } from '@sushiswap/chain'
import type { Token } from '@sushiswap/currency'

import type { PoolCode } from '../pools/PoolCode'

export enum LiquidityProviders {
  SushiSwap = 'SushiSwap',
  UniswapV2 = 'UniswapV2',
  Trident = 'Trident',
  QuickSwap = 'QuickSwap',
  ApeSwap = 'ApeSwap',
  Dfyn = 'Dfyn',
  Elk = 'Elk',
  JetSwap = 'JetSwap',
  SpookySwap = 'SpookySwap',
  NativeWrap = 'NativeWrap',
}

export abstract class LiquidityProvider {
  chainId: ChainId
  stateId = 0
  lastUpdateBlock = 0
  constructor(chainId: ChainId) {
    this.chainId = chainId
  }

  abstract getType(): LiquidityProviders

  /**
   * The name of liquidity provider to be used for pool naming. For example, 'SushiSwap'
   */
  abstract getPoolProviderName(): string

  /**
   * Initiates event listeners for top pools
   */
  abstract startFetchPoolsData(): void

  /**
   * Fetches relevant pools for the given tokens
   * @param t0 Token
   * @param t1 Token
   */
  abstract fetchPoolsForToken(t0: Token, t1: Token): void

  /**
   * Returns a list of PoolCode
   * @returns PoolCode[]
   */
  abstract getCurrentPoolList(): PoolCode[]

  /**
   * Returns current stateId
   * @returns current stateId
   */
  getCurrentPoolStateId() {
    return this.stateId
  }

  abstract stopFetchPoolsData(): void

  /**
   * Returns last processed block number
   * @returns last processed block number
   */
  getLastUpdateBlock(): number {
    return this.lastUpdateBlock
  }
}
