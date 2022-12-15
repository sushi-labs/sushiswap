import { ChainId } from '@sushiswap/chain'
import { GRAPH_HOST_ENDPOINT } from '../../config.js'

export const GRAPH_HOST: Record<number | string, string> = {
  [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
}
export const SWAPFISH_SUPPORTED_CHAINS = [ChainId.ARBITRUM]
export const SWAPFISH_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'swapfish/swapfish',
}