import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [ChainId.AVALANCHE, ChainId.ETHEREUM]

const GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_GRAPH_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

const KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/name'
const PENDING_KAVA_HOST_ENDPOINT = 'api.thegraph.com/subgraphs/id'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
}

export const CHAIN_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.AVALANCHE]: 'Avalanche',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
}
