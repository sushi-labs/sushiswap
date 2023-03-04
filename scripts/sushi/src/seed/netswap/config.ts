import { ChainId } from '@sushiswap/chain'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.METIS]: 'andromeda.thegraph.metis.io',
}
export const NETSWAP_V2_SUPPORTED_CHAINS = [ChainId.METIS]
export const NETSWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.METIS]: 'netswap/exchange',
}
