import { ChainId } from '@sushiswap/chain'
import { TridentChainId, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'

export const isTridentChain = (chainId: ChainId): chainId is TridentChainId =>
  Object.keys(TRIDENT_SUBGRAPH_NAME).map(Number).includes(chainId)
