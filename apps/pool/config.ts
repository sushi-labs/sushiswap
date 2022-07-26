import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [ChainId.AVALANCHE, ChainId.ETHEREUM]

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'

export const KAVA_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_KAVA_HOST = 'api.thegraph.com/subgraphs/id'

export const CHAIN_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.AVALANCHE]: 'Avalanche',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
}
