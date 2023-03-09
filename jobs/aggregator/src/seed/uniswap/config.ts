import { ChainId } from '@sushiswap/chain'

import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
  [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
}
export const UNISWAP_V2_SUPPORTED_CHAINS = [ChainId.ETHEREUM]
export const UNISWAP_V2_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'uniswap/uniswap-v2',
}

export const UNISWAP_V3_SUPPORTED_CHAINS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM]
export const UNISWAP_V3_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'uniswap/uniswap-v3',
  [ChainId.ARBITRUM]: 'ianlapham/arbitrum-minimal',
  [ChainId.POLYGON]: 'ianlapham/uniswap-v3-polygon',
  //messari/uniswap-v3-optimism
}
