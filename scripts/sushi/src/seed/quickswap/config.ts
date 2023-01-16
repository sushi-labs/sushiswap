import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
}
export const QUICKSWAP_SUPPORTED_CHAINS = [ChainId.POLYGON]
export const QUICKSWAP_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.POLYGON]: 'sameepsi/quickswap06',
}