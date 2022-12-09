import { ChainId } from '@sushiswap/chain'
import { SushiSwapChainId, SUSHISWAP_SUBGRAPH_NAME } from '@sushiswap/graph-config'

export const isSushiSwapChain = (chainId: ChainId): chainId is SushiSwapChainId =>
  Object.keys(SUSHISWAP_SUBGRAPH_NAME).map(Number).includes(chainId)
