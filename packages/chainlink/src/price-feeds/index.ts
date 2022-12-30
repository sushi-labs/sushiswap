import { ChainId } from '@sushiswap/chain'

import ARBITRUM from './arbitrum'
import AVALANCHE from './avalanche'
import BSC from './bsc'
import ETHEREUM from './ethereum'
import GNOSIS from './gnosis'
import HECO from './heco'
import KOVAN from './kovan'
import POLYGON from './polygon'

export interface ChainlinkPriceFeedEntry {
  from: string
  to: string
  decimals: number
  fromDecimals: number
  toDecimals: number
}

export type ChainlinkPriceFeedMap = {
  readonly [address: string]: ChainlinkPriceFeedEntry
}

export const CHAINLINK_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.KOVAN,
  ChainId.BSC,
  ChainId.HECO,
  ChainId.POLYGON,
  ChainId.GNOSIS,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
] as const

export const CHAINLINK_PRICE_FEED_MAP: {
  readonly [key in typeof CHAINLINK_SUPPORTED_CHAIN_IDS[number]]: ChainlinkPriceFeedMap
} = {
  [ChainId.ETHEREUM]: ETHEREUM,
  [ChainId.KOVAN]: KOVAN,
  [ChainId.BSC]: BSC,
  [ChainId.HECO]: HECO,
  [ChainId.POLYGON]: POLYGON,
  [ChainId.GNOSIS]: GNOSIS,
  [ChainId.ARBITRUM]: ARBITRUM,
  [ChainId.AVALANCHE]: AVALANCHE,
}
