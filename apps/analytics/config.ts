import { ChainId } from '@sushiswap/chain'

export const ENABLED_NETWORKS = [ChainId.AVALANCHE, ChainId.BSC]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  // [ChainId.GNOSIS]: 'sushiswap/sushiswap-gnosis',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  // [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
}

export const GRAPH_HOST = {
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
}
