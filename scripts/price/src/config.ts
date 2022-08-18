import { ChainId } from '@sushiswap/chain'

export const SUSHISWAP_CHAINS = [
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.POLYGON,
  ChainId.HARMONY,
]

export const TRIDENT_CHAINS = [ChainId.OPTIMISM, ChainId.POLYGON]

export const GRAPH_HOST = 'api.thegraph.com'

export const GRAPH_CURRENT_PATH = 'subgraphs/name'

export const GRAPH_PENDING_PATH = 'subgraphs/id'

export const SUSHISWAP_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.GNOSIS]: 'sushiswap/exchange-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
  [ChainId.HARMONY]: 'sushiswap/exchange-harmony',
}

export const TRIDENT_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.OPTIMISM]: 'sushiswap/trident-optimism',
  [ChainId.POLYGON]: 'sushiswap/trident-polygon',
}
