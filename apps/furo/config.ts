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
  [ChainId.ETHEREUM]: 'sushi-subgraphs/furo-ethereum',
  [ChainId.GÖRLI]: 'sushi-subgraphs/furo-goerli',
  [ChainId.ARBITRUM]: 'sushi-subgraphs/furo-arbitrum',
  [ChainId.AVALANCHE]: 'sushi-subgraphs/furo-avalanche',
  [ChainId.BSC]: 'sushi-subgraphs/furo-bsc',
  [ChainId.FANTOM]: 'sushi-subgraphs/furo-fantom',
  [ChainId.GNOSIS]: 'sushi-subgraphs/furo-gnosis',
  [ChainId.HARMONY]: 'sushi-subgraphs/furo-harmony',
  [ChainId.MOONBEAM]: 'sushi-subgraphs/furo-moonbeam',
  [ChainId.MOONRIVER]: 'sushi-subgraphs/furo-moonriver',
  [ChainId.OPTIMISM]: 'sushi-subgraphs/furo-optimism',
  [ChainId.POLYGON]: 'sushi-subgraphs/furo-polygon',
}
