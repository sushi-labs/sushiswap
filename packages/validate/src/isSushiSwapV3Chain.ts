import { ChainId } from '@sushiswap/chain'
import { SUSHISWAP_V3_SUBGRAPH_NAME, SushiSwapV3ChainId } from '@sushiswap/graph-config'

export const isSushiSwapV3Chain = (chainId: ChainId): chainId is SushiSwapV3ChainId =>
  Object.keys(SUSHISWAP_V3_SUBGRAPH_NAME).map(Number).includes(chainId)
