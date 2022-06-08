import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.GÖRLI,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
]

export const GRAPH_HOST = 'api.thegraph.com'

export const BENTOBOX_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'matthewlilley/bentobox-ethereum',
  [ChainId.GÖRLI]: 'matthewlilley/bentobox-goerli',
  [ChainId.ARBITRUM]: 'matthewlilley/bentobox-arbitrum',
  [ChainId.AVALANCHE]: 'matthewlilley/bentobox-avalanche',
  [ChainId.BSC]: 'matthewlilley/bentobox-bsc',
  [ChainId.FANTOM]: 'matthewlilley/bentobox-fantom',
  [ChainId.GNOSIS]: 'matthewlilley/bentobox-gnosis',
  [ChainId.HARMONY]: 'matthewlilley/bentobox-harmony',
  [ChainId.MOONBEAM]: 'matthewlilley/bentobox-moonbase',
  [ChainId.MOONRIVER]: 'matthewlilley/bentobox-moonriver',
  [ChainId.OPTIMISM]: 'matthewlilley/bentobox-optimism',
  [ChainId.POLYGON]: 'matthewlilley/bentobox-polygon',
}

export const FURO_STREAM_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/furo-stream-ethereum',
  [ChainId.GÖRLI]: 'sushiswap/furo-stream-goerli',
  [ChainId.ARBITRUM]: 'sushiswap/furo-stream-arbitrum',
  [ChainId.AVALANCHE]: 'sushiswap/furo-stream-avalanche',
  [ChainId.BSC]: 'sushiswap/furo-stream-bsc',
  [ChainId.FANTOM]: 'sushiswap/furo-stream-fantom',
  [ChainId.GNOSIS]: 'sushiswap/furo-stream-gnosis',
  [ChainId.HARMONY]: 'sushiswap/furo-stream-harmony',
  [ChainId.MOONBEAM]: 'sushiswap/furo-stream-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/furo-stream-moonriver',
  [ChainId.OPTIMISM]: 'sushiswap/furo-stream-optimism',
  [ChainId.POLYGON]: 'sushiswap/furo-stream-polygon',
}

export const FURO_VESTING_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/furo-vesting-ethereum',
  [ChainId.GÖRLI]: 'sushiswap/furo-vesting-goerli',
  [ChainId.ARBITRUM]: 'sushiswap/furo-vesting-arbitrum',
  [ChainId.AVALANCHE]: 'sushiswap/furo-vesting-avalanche',
  [ChainId.BSC]: 'sushiswap/furo-vesting-bsc',
  [ChainId.FANTOM]: 'sushiswap/furo-vesting-fantom',
  [ChainId.GNOSIS]: 'sushiswap/furo-vesting-gnosis',
  [ChainId.HARMONY]: 'sushiswap/furo-vesting-harmony',
  [ChainId.MOONBEAM]: 'sushiswap/furo-vesting-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/furo-vesting-moonriver',
  [ChainId.OPTIMISM]: 'sushiswap/furo-vesting-optimism',
  [ChainId.POLYGON]: 'sushiswap/furo-vesting-polygon',
}
