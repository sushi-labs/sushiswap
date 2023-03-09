import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
}
export const SPIRITSWAP_V2_SUPPORTED_CHAINS = [ChainId.FANTOM]
export const SPIRITSWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.FANTOM]: 'spirit-dao/spiritswapv2-analytics',
}
