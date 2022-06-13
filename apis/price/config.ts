import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAINS = [
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HECO,
  // ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.FUSE,
  ChainId.POLYGON,
]

export const GRAPH_HOST = 'api.thegraph.com'

export const LEGACY_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'jiro-ono/sushitestsubgraph',
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.GNOSIS]: 'sushiswap/xdai-exchange',
  [ChainId.HECO]: 'heco-exchange/heco',
  // [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-exchange',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-exchange',
  [ChainId.FUSE]: 'sushiswap/fuse-exchange',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
}
