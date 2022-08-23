import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [
  // ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.ARBITRUM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  // ChainId.HARMONY,
]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

const KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

export const GRAPH_HOST = {
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
  [ChainId.METIS]: 'https://jsonrpc.andromeda.thegraph.metis.io',
  [ChainId.KAVA]: 'https://pvt-admin.graph.kava.io',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/sushiswap-arbitrum',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  [ChainId.CELO]: 'sushiswap/sushiswap-celo',
  [ChainId.FANTOM]: 'sushiswap/sushiswap-fantom',
  [ChainId.FUSE]: 'sushiswap/sushiswap-fuse',
  [ChainId.GNOSIS]: 'sushiswap/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
}

export const STAKING_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'olastenberg/staking-arbitrum',
}
export const STAKING_ENABLED_NETWORKS = [ChainId.ARBITRUM]

export const TRIDENT_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.OPTIMISM]: 'sushiswap/trident-optimism',
  [ChainId.POLYGON]: 'sushiswap/trident-polygon',
  [ChainId.METIS]: 'sushiswap/trident-metis',
  [ChainId.KAVA]: 'sushiswap/trident-kava',
}

export const TRIDENT_ENABLED_NETWORKS = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.METIS, ChainId.KAVA]

export const AMM_ENABLED_NETWORKS = [
  // ChainId.ETHEREUM,
  ChainId.AVALANCHE,
  ChainId.ARBITRUM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  // ChainId.HARMONY,
  // ChainId.POLYGON,
]
