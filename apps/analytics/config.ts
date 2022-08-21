import { ChainId } from '@sushiswap/chain'

export const ENABLED_NETWORKS = [
  // ChainId.ETHEREUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  // ChainId.HARMONY,
  // ChainId.FANTOM,
  // ChainId.POLYGON,
]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  [ChainId.CELO]: 'sushiswap/sushiswap-celo',
  [ChainId.FUSE]: 'sushiswap/sushiswap-fuse',
  [ChainId.GNOSIS]: 'sushiswap/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
  [ChainId.HARMONY]: 'sushiswap/sushiswap-harmony',
  [ChainId.FANTOM]: 'sushiswap/sushiswap-fantom',
  [ChainId.POLYGON]: 'sushiswap/sushiswap-polygon',
}

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
  [ChainId.FUSE]: GRAPH_HOST_ENDPOINT,
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
  [ChainId.HARMONY]: GRAPH_HOST_ENDPOINT,
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
}
