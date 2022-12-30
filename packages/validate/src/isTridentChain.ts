import { SushiSwapChainId, TRIDENT_SUBGRAPH_NAME, TridentChainId } from '@sushiswap/graph-config'

export const isTridentChain = (chainId: SushiSwapChainId | TridentChainId): chainId is TridentChainId =>
  Object.keys(TRIDENT_SUBGRAPH_NAME).map(Number).includes(chainId)
