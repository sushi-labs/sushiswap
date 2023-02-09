import { ChainId, chainShortName } from '@sushiswap/chain'
import type { Token } from '@sushiswap/currency'

import type { PoolCode } from '../pools/PoolCode'

export enum LiquidityProviders {
  SushiSwap = 'SushiSwap',
  UniswapV2 = 'UniswapV2',
  Trident = 'Trident',
  TridentCP = 'Trident CP',
  TridentStable = 'Trident Stable',
  QuickSwap = 'QuickSwap',
  ApeSwap = 'ApeSwap',
  PancakeSwap = 'PancakeSwap',
  TraderJoe = 'TraderJoe',
  Dfyn = 'Dfyn',
  Elk = 'Elk',
  JetSwap = 'JetSwap',
  SpookySwap = 'SpookySwap',
  NetSwap = 'NetSwap',
  NativeWrap = 'NativeWrap',
}

export abstract class LiquidityProvider {
  chainId: ChainId
  stateId = 0
  lastUpdateBlock = 0
  readonly ON_DEMAND_POOLS_BLOCK_LIFETIME = 150
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
   * @param t0 Token
   * @param t1 Token
   * @returns PoolCode[]
   */
  abstract getCurrentPoolList(t0: Token, t1: Token): PoolCode[]

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

  /**
   * Logs a message with the following format:
   * <chainId>~<lastUpdateBlock>~<providerName>
   * Example: 1~123456~SushiSwap
   * @returns string
   */
  getLogPrefix(): string {
    return `${chainShortName[this.chainId]}/${this.chainId}~${this.lastUpdateBlock}~${this.getType()}`
  }

  getOnDemandId = (t0: Token, t1: Token) =>
    [t0.address, t1.address].sort((first, second) => (first > second ? -1 : 1)).join(':')
}
