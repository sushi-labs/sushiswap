import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
  [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
}
export const JETSWAP_V2_SUPPORTED_CHAINS = [ChainId.POLYGON, ChainId.BSC, ChainId.FANTOM]
export const JETSWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.POLYGON]: 'smartcookie0501/jetswap-subgraph-polygon',
  [ChainId.BSC]: 'smartcookie0501/jetswap-subgraph',
  [ChainId.FANTOM]: 'smartcookie0501/jetswap-subgraph-fantom',
}
