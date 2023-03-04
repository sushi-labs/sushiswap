import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
}
export const UBESWAP_V2_SUPPORTED_CHAINS = [ChainId.CELO]
export const UBESWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.CELO]: 'ubeswap/ubeswap',
}
