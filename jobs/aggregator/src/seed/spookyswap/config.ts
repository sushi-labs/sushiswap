import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
}
export const SPOOKYSWAP_V2_SUPPORTED_CHAINS = [ChainId.FANTOM]
export const SPOOKYSWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.FANTOM]: 'int3grtor/spooky-exchange',
}
