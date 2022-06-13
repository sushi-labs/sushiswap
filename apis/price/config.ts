import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAINS = [
  // ChainId.ETHEREUM,
  // ChainId.GÖRLI,
  ChainId.ARBITRUM,
  // ChainId.AVALANCHE,
  // ChainId.BSC,
  // ChainId.FANTOM,
  // ChainId.GNOSIS,
  // ChainId.HARMONY,
  // ChainId.MOONBEAM,
  // ChainId.MOONRIVER,
  // ChainId.OPTIMISM,
  // ChainId.POLYGON,
]

export const GRAPH_HOST = 'api.thegraph.com'

export const LEGACY_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
}
