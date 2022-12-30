import { ChainId } from '@sushiswap/chain'
import { TRIDENT_SUBGRAPH_NAME, TridentChainId } from '@sushiswap/graph-config'

export const isTridentChain = (chainId: ChainId): chainId is TridentChainId =>
  Object.keys(TRIDENT_SUBGRAPH_NAME).map(Number).includes(chainId)
