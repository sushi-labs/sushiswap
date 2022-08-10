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
  [ChainId.HARMONY]: THE_GRAPH,
  [ChainId.OKEX]: HYPER_GRAPH,
  [ChainId.HECO]: HYPER_GRAPH,
  [ChainId.MOONRIVER]: THE_GRAPH,
  [ChainId.TELOS]: THE_GRAPH,
  [ChainId.FUSE]: THE_GRAPH,
  [ChainId.MOONBEAM]: THE_GRAPH,
}

export const EXCHANGE = {
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-exchange',
  [ChainId.AVALANCHE]: 'sushiswap/avalanche-exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/celo-exchange',
  [ChainId.FANTOM]: 'sushiswap/fantom-exchange',
  [ChainId.HARMONY]: 'sushiswap/harmony-exchange',
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
  [ChainId.GNOSIS]: 'sushiswap/xdai-exchange',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-exchange',
  [ChainId.FUSE]: 'sushiswap/fuse-exchange',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-exchange',
}

export const TRIDENT = {
  [ChainId.POLYGON]: 'sushiswap/trident-polygon',
  [ChainId.OPTIMISM]: 'olastenberg/trident-optimism',
  [ChainId.KAVA]: 'sushiswap/trident-kava',
  [ChainId.METIS]: 'sushiswap/trident-metis',
}

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.MOONRIVER,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.TELOS,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.OKEX,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.KAVA,
  ChainId.METIS,
] as const

export const CHAIN_NAME: Record<typeof SUPPORTED_CHAINS[number], string> = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.BSC]: 'BSC',
  [ChainId.GNOSIS]: 'Gnosis',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.TELOS]: 'Telos',
  [ChainId.CELO]: 'Celo',
  [ChainId.FUSE]: 'Fuse',
  [ChainId.OKEX]: 'OKEx',
  [ChainId.HECO]: 'HECO',
  [ChainId.PALM]: 'Palm',
  [ChainId.KAVA]: 'Kava',
  [ChainId.METIS]: 'Metis',
}
