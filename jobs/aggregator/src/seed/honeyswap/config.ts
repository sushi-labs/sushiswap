import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
}

export const HONEYSWAP_V2_SUPPORTED_CHAINS = [ChainId.GNOSIS]
export const HONEYSWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.GNOSIS]: '1hive/honeyswap-xdai',
}
