import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS: ChainId[] = [
  // ChainId.OPTIMISM,
  // ChainId.POLYGON,
  // ChainId.KAVA,
  // ChainId.METIS,
]

export const AMM_ENABLED_NETWORKS = [
  // ChainId.ETHEREUM,
  ChainId.AVALANCHE,
  ChainId.ARBITRUM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FANTOM,
  // ChainId.FUSE,
  // ChainId.GNOSIS,
  // ChainId.MOONBEAM,
  // ChainId.MOONRIVER,
]

export const SUPPORTED_CHAIN_IDS = [...TRIDENT_ENABLED_NETWORKS, ...AMM_ENABLED_NETWORKS]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

const KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.OPTIMISM]: GRAPH_HOST_ENDPOINT,
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
  [ChainId.HARMONY]: GRAPH_HOST_ENDPOINT,
  [ChainId.KAVA]: 'pvt.graph.kava.io/subgraphs/name',
  [ChainId.METIS]: 'andromeda.thegraph.metis.io/subgraphs/name',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'subgraph-qa/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'subgraph-qa/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'subgraph-qa/sushiswap-arbitrum',
  [ChainId.BSC]: 'subgraph-qa/sushiswap-bsc',
  [ChainId.CELO]: 'subgraph-qa/sushiswap-celo',
  [ChainId.FANTOM]: 'subgraph-qa/sushiswap-fantom',
  [ChainId.FUSE]: 'subgraph-qa/sushiswap-fuse',
  [ChainId.GNOSIS]: 'subgraph-qa/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'subgraph-qa/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'subgraph-qa/sushiswap-moonriver',
  [ChainId.HARMONY]: 'subgraph-qa/sushiswap-harmony',
}

export const STAKING_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'olastenberg/staking-arbitrum',
}
export const STAKING_ENABLED_NETWORKS = [ChainId.ARBITRUM]

export const TRIDENT_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.OPTIMISM]: 'sushi-labs/trident-optimism',
  [ChainId.POLYGON]: 'sushi-graph/trident-polygon',
  [ChainId.METIS]: 'sushi-labs/trident-metis',
  [ChainId.KAVA]: 'sushiswap/trident-kava',
}

export const BLOCK_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'blocklytics/ethereum-blocks',
  [ChainId.GNOSIS]: 'matthewlilley/xdai-blocks',
  [ChainId.POLYGON]: 'matthewlilley/polygon-blocks',
  [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
  [ChainId.BSC]: 'matthewlilley/bsc-blocks',
  [ChainId.HARMONY]: 'sushiswap/harmony-blocks',
  [ChainId.AVALANCHE]: 'matthewlilley/avalanche-blocks',
  [ChainId.CELO]: 'ubeswap/celo-blocks',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-blocks',
  [ChainId.OKEX]: 'okexchain-blocks/oec',
  [ChainId.HECO]: 'hecoblocks/heco',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-blocks',
  [ChainId.FUSE]: 'sushiswap/fuse-blocks',
  [ChainId.KOVAN]: 'blocklytics/kovan-blocks',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-blocks',
  [ChainId.OPTIMISM]: 'kybernetwork/optimism-blocks',
  [ChainId.KAVA]: 'sushiswap/blocks-kava',
  [ChainId.METIS]: 'sushiswap/blocks-metis',
}
