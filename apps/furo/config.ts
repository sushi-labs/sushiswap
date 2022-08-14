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

export const FURO_SUBGRAPH_NAME: Record<string | number, string> = {
  [ChainId.ETHEREUM]: 'sushi-labs/furo-ethereum',
  [ChainId.GÖRLI]: 'sushi-labs/furo-goerli',
  [ChainId.ARBITRUM]: 'sushi-labs/furo-arbitrum',
  [ChainId.AVALANCHE]: 'sushi-labs/furo-avalanche',
  [ChainId.BSC]: 'sushi-labs/furo-bsc',
  [ChainId.FANTOM]: 'sushi-labs/furo-fantom',
  [ChainId.GNOSIS]: 'sushi-labs/furo-gnosis',
  [ChainId.HARMONY]: 'sushi-labs/furo-harmony',
  [ChainId.MOONBEAM]: 'sushi-labs/furo-moonbeam',
  [ChainId.MOONRIVER]: 'sushi-labs/furo-moonriver',
  [ChainId.OPTIMISM]: 'sushi-labs/furo-optimism',
  [ChainId.POLYGON]: 'sushi-labs/furo-polygon',
}
