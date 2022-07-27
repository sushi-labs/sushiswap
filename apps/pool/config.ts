import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [ChainId.AVALANCHE, ChainId.ETHEREUM]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

const KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.HARMONY]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
  [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
  [ChainId.OKEX]: GRAPH_HOST_ENDPOINT,
  [ChainId.HECO]: GRAPH_HOST_ENDPOINT,
  [ChainId.FUSE]: GRAPH_HOST_ENDPOINT,
  [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
}

export const CHAIN_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.AVALANCHE]: 'Avalanche',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.GNOSIS]: 'sushiswap/xdai-exchange',
  [ChainId.POLYGON]: 'sushiswap/exchange-polygon',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.OKEX]: 'okex-exchange/oec',
  [ChainId.HECO]: 'heco-exchange/heco',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
}

export const ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.GNOSIS,
  ChainId.POLYGON,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.HARMONY,
  ChainId.AVALANCHE,
  ChainId.CELO,
  ChainId.ARBITRUM,
  ChainId.MOONRIVER,
  ChainId.OKEX,
  ChainId.HECO,
  ChainId.FUSE,
  ChainId.MOONBEAM,
]
