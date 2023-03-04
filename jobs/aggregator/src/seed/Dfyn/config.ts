import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
}
export const DFYN_V2_SUPPORTED_CHAINS = [ChainId.POLYGON]
export const DFYN_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.POLYGON]: 'ss-sonic/dfyn-v4',
}
