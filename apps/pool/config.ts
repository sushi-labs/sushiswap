import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.AVALANCHE,
  // ChainId.ARBITRUM,
  ChainId.MOONBEAM,
  ChainId.FUSE,
  // ChainId.MOONRIVER,
  // ChainId.FANTOM,
  ChainId.BSC,
  // ChainId.GNOSIS,
]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

const KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  // [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.AVALANCHE]: 'sushiswap/sushiswap-avalanche',
  // [ChainId.ARBITRUM]: 'sushi-labs/sushiswap-arbitrum',
  [ChainId.MOONBEAM]: 'sushiswap/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/sushiswap-moonriver',
  [ChainId.FUSE]: 'sushiswap/sushiswap-fuse',
  // [ChainId.FANTOM]: 'sushi-labs/sushiswap-fantom',
  [ChainId.BSC]: 'sushiswap/sushiswap-bsc',
  // [ChainId.GNOSIS]: 'sushi-labs/sushiswap-gnosis',
}

export const STAKING_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'olastenberg/staking-arbitrum',
}
export const STAKING_ENABLED_NETWORKS = [ChainId.ARBITRUM]

export const AMM_ENABLED_NETWORKS = [
  ChainId.AVALANCHE,
  // ChainId.ARBITRUM,
  ChainId.MOONBEAM,
  ChainId.FUSE,
  // ChainId.MOONRIVER,
  // ChainId.FANTOM,
  ChainId.BSC,
  // ChainId.GNOSIS,
]
