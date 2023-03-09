import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
}
export const TRADERJOE_V2_SUPPORTED_CHAINS = [ChainId.AVALANCHE]
export const TRADERJOE_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.AVALANCHE]: 'traderjoe-xyz/exchange',
}
