import { ChainId } from '@sushiswap/chain'

const THE_GRAPH = 'https://api.thegraph.com'
const HYPER_GRAPH = 'https://q.hg.network'

export const GRAPH_HOST = {
  [ChainId.ETHEREUM]: THE_GRAPH,
  [ChainId.GNOSIS]: THE_GRAPH,
  [ChainId.POLYGON]: THE_GRAPH,
  [ChainId.FANTOM]: THE_GRAPH,
  [ChainId.BSC]: THE_GRAPH,
  [ChainId.AVALANCHE]: THE_GRAPH,
  [ChainId.CELO]: THE_GRAPH,
  [ChainId.ARBITRUM]: THE_GRAPH,
  [ChainId.HARMONY]: 'https://sushi.graph.t.hmny.io',
  [ChainId.OKEX]: HYPER_GRAPH,
  [ChainId.HECO]: HYPER_GRAPH,
  [ChainId.MOONRIVER]: THE_GRAPH,
  [ChainId.TELOS]: THE_GRAPH,
  [ChainId.FUSE]: THE_GRAPH,
  [ChainId.MOONBEAM]: THE_GRAPH,
}

export const TRIDENT = {
  [ChainId.POLYGON]: 'matthewlilley/trident-polygon',
}
