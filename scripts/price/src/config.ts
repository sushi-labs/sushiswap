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

export const TRIDENT_CHAINS = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.METIS, ChainId.KAVA]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.OPTIMISM]: GRAPH_HOST_ENDPOINT,
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
  [ChainId.FUSE]: GRAPH_HOST_ENDPOINT,
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
  [ChainId.KAVA]: 'pvt.graph.kava.io',
  [ChainId.METIS]: 'andromeda.thegraph.metis.io',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushi-graph/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/sushiswap-arbitrum',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  [ChainId.CELO]: 'sushiswap/sushiswap-celo',
  [ChainId.FANTOM]: 'sushiswap/sushiswap-fantom',
  [ChainId.FUSE]: 'sushiswap/sushiswap-fuse',
  [ChainId.GNOSIS]: 'sushiswap/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
  [ChainId.HARMONY]: 'sushi-graph/sushiswap-harmony',
  [ChainId.POLYGON]: 'sushiswap/exchange-polygon',
}

export const TRIDENT_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.OPTIMISM]: 'sushi-labs/trident-optimism',
  [ChainId.POLYGON]: 'sushi-graph/trident-polygon',
  [ChainId.METIS]: 'sushiswap/trident-metis',
  [ChainId.KAVA]: 'sushiswap/trident-kava',
}
