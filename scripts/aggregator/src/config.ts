import { ChainId } from '@sushiswap/chain'

export enum ProtocolVersion {
  V2 = 'V2',
  LEGACY = 'LEGACY',
  TRIDENT = 'TRIDENT',
  V3 = 'V3',
}

export enum ProtocolName {
  SUSHISWAP = 'SushiSwap',
  UNISWAP = 'UniSwap',
  PANCAKESWAP = 'PancakeSwap',
  QUICKSWAP = 'QuickSwap',
  SWAPFISH = 'SwapFish',
  TRADERJOE = 'TraderJoe',
  SPOOKYSWAP = 'SpookySwap',
  UBESWAP = 'UbeSwap',
  HONEYSWAP = 'HoneySwap',
}

export enum PoolType {
  CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL',
  STABLE_POOL = 'STABLE_POOL',
  CONCENTRATED_LIQUIDITY_POOL = 'CONCENTRATED_LIQUIDITY_POOL',
}

export enum Price {
  USD = 'USD',
  NATIVE = 'NATIVE',
}

export const GRAPH_HOST_ENDPOINT = 'api.thegraph.com'
export const SUSHI_HOST_ENDPOINT = 'subgraphs.sushi.com'

