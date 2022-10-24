import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.KAVA, ChainId.METIS] as const

export const SUSHISWAP_ENABLED_NETWORKS = [
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.POLYGON,
  ChainId.HARMONY,
  ChainId.ARBITRUM_NOVA,
  ChainId.BOBA,
  // ChainId.PALM,
  // ChainId.HECO,
  // ChainId.OKEX
] as const

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'

export const KAVA_HOST = 'pvt.graph.kava.io/subgraphs/name'
export const PENDING_KAVA_HOST = 'pvt.graph.kava.io/subgraphs/id'

export const METIS_HOST = 'andromeda.thegraph.metis.io/subgraphs/name'
export const PENDING_METIS_HOST = 'andromeda.thegraph.metis.io/subgraphs/id'

export const CHAIN_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'Arbitrum',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.BSC]: 'Bsc',
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.GNOSIS]: 'Gnosis',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.MOONBEAM]: 'Moonbeam',
  [ChainId.MOONRIVER]: 'Moonriver',
  [ChainId.OPTIMISM]: 'Optimism',
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.TELOS]: 'Telos',
  [ChainId.CELO]: 'Celo',
  [ChainId.FUSE]: 'Fuse',
  [ChainId.OKEX]: 'OKEx',
  [ChainId.HECO]: 'HECO',
  [ChainId.PALM]: 'Palm',
  [ChainId.KAVA]: 'Kava',
  [ChainId.METIS]: 'Metis',
  [ChainId.BOBA]: 'Boba',
  [ChainId.ARBITRUM_NOVA]: 'Arbitrum Nova',
  [ChainId.BOBA_AVAX]: 'Boba Avax',
}

export const SUBGRAPH_HOST: Record<number | string, string> = {
  [ChainId.ARBITRUM]: GRAPH_HOST,
  [ChainId.ARBITRUM_NOVA]: 'arbitrum-nova-subgraph.sushi.com/subgraphs/name',
  [ChainId.AVALANCHE]: GRAPH_HOST,
  [ChainId.BSC]: GRAPH_HOST,
  [ChainId.CELO]: GRAPH_HOST,
  [ChainId.ETHEREUM]: GRAPH_HOST,
  [ChainId.FANTOM]: GRAPH_HOST,
  [ChainId.FUSE]: GRAPH_HOST,
  [ChainId.GNOSIS]: GRAPH_HOST,
  [ChainId.GÖRLI]: GRAPH_HOST,
  [ChainId.HARMONY]: GRAPH_HOST,
  [ChainId.KAVA]: KAVA_HOST,
  [ChainId.METIS]: METIS_HOST,
  [ChainId.MOONBEAM]: GRAPH_HOST,
  [ChainId.MOONRIVER]: GRAPH_HOST,
  [ChainId.OPTIMISM]: 'api.thegraph.com/subgraphs/name',
  [ChainId.POLYGON]: GRAPH_HOST,
  [ChainId.BOBA]: GRAPH_HOST,
}

export const BENTOBOX_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/bentobox-ethereum',
  [ChainId.POLYGON]: 'sushiswap/bentobox-polygon',
  [ChainId.AVALANCHE]: 'sushiswap/bentobox-avalanche',
  [ChainId.BSC]: 'sushiswap/bentobox-bsc',
  [ChainId.FANTOM]: 'sushiswap/bentobox-fantom',
  [ChainId.GNOSIS]: 'sushiswap/bentobox-gnosis',
  [ChainId.ARBITRUM]: 'sushiswap/bentobox-arbitrum',
  [ChainId.CELO]: 'sushiswap/bentobox-celo',
  [ChainId.MOONRIVER]: 'sushiswap/bentobox-moonriver',
  [ChainId.MOONBEAM]: 'sushiswap/bentobox-moonbeam',
  [ChainId.OPTIMISM]: 'sushiswap/bentobox-optimism',
  [ChainId.HARMONY]: 'sushiswap/bentobox-harmony',
  [ChainId.KAVA]: 'sushiswap/bentobox-kava',
}

export const BLOCKS_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'blocklytics/ethereum-blocks',
  [ChainId.GNOSIS]: 'matthewlilley/xdai-blocks',
  [ChainId.POLYGON]: 'matthewlilley/polygon-blocks',
  [ChainId.FANTOM]: 'matthewlilley/fantom-blocks',
  [ChainId.BSC]: 'matthewlilley/bsc-blocks',
  [ChainId.HARMONY]: 'sushiswap/harmony-blocks',
  [ChainId.AVALANCHE]: 'matthewlilley/avalanche-blocks',
  [ChainId.CELO]: 'ubeswap/celo-blocks',
  [ChainId.ARBITRUM]: 'sushiswap/arbitrum-blocks',
  [ChainId.OKEX]: 'okexchain-blocks/oec',
  [ChainId.HECO]: 'hecoblocks/heco',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-blocks',
  [ChainId.FUSE]: 'sushiswap/fuse-blocks',
  [ChainId.KOVAN]: 'blocklytics/kovan-blocks',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-blocks',
  [ChainId.OPTIMISM]: 'kybernetwork/optimism-blocks',
  [ChainId.KAVA]: 'sushiswap/blocks-kava',
  [ChainId.METIS]: 'sushiswap/blocks-metis',
  [ChainId.ARBITRUM_NOVA]: 'sushiswap/blocks-arbitrum-nova',
  [ChainId.BOBA]: 'sushiswap/blocks-boba',
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.GNOSIS]: 'sushiswap/xdai-exchange',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
  [ChainId.HARMONY]: 'sushiswap/exchange-harmony',
  [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
  [ChainId.POLYGON]: 'sushiswap/exchange-polygon',
  [ChainId.BOBA]: 'sushi-0m/sushiswap-boba',
}

export const SUSHISWAP_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'subgraph-qa/sushiswap-ethereum',
  [ChainId.AVALANCHE]: 'sushi-0m/sushiswap-avalanche',
  [ChainId.ARBITRUM]: 'sushi-0m/sushiswap-arbitrum',
  [ChainId.BSC]: 'sushi-0m/sushiswap-bsc',
  [ChainId.CELO]: 'sushi-0m/sushiswap-celo',
  [ChainId.FANTOM]: 'sushi-0m/sushiswap-fantom',
  [ChainId.FUSE]: 'sushi-0m/sushiswap-fuse',
  [ChainId.GNOSIS]: 'sushi-0m/sushiswap-gnosis',
  [ChainId.MOONBEAM]: 'sushi-0m/sushiswap-moonbeam',
  [ChainId.MOONRIVER]: 'sushi-0m/sushiswap-moonriver',
  [ChainId.HARMONY]: 'subgraph-qa/sushiswap-harmony',
  [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
  [ChainId.BOBA]: 'sushi-0m/sushiswap-boba',
  [ChainId.POLYGON]: 'subgraph-qa/sushiswap-polygon',
}

export const TRIDENT_SUBGRAPH_NAME = {
  [ChainId.POLYGON]: 'sushi-qa/trident-polygon',
  [ChainId.OPTIMISM]: 'sushi-qa/trident-optimism',
  [ChainId.KAVA]: 'sushi-qa/trident-kava',
  [ChainId.METIS]: 'sushi-qa/trident-metis',
} as const

export const TRIDENT_SUBGRAPH_START_BLOCK: Record<keyof typeof TRIDENT_SUBGRAPH_NAME, number> = {
  [ChainId.POLYGON]: 34188953,
  [ChainId.OPTIMISM]: 7464195,
  [ChainId.KAVA]: 162097,
  [ChainId.METIS]: 3030678,
}

export const MINICHEF_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.POLYGON]: 'jiro-ono/minichef-staging-updates', // new trident subgraph not synced yet
  [ChainId.GNOSIS]: 'jiro-ono/gnosis-minichef-staging',
  // [ChainId.HARMONY]: 'sushiswap/harmony-minichef', // subgraph broken
  [ChainId.ARBITRUM]: 'jiro-ono/arbitrum-minichef-staging',
  [ChainId.CELO]: 'sushiswap/celo-minichef-v2',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-minichef',
  [ChainId.FUSE]: 'sushiswap/fuse-minichef',
  [ChainId.FANTOM]: 'sushiswap/fantom-minichef',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-minichef',
  [ChainId.KAVA]: 'sushiswap/kava-minichef', //block subgraph not synced yet
  [ChainId.METIS]: 'sushiswap/metis-minichef',
  [ChainId.BOBA]: 'sushiswap/minichef-boba',
}

export const MASTERCHEF_V1_SUBGRAPH_NAME = 'jiro-ono/masterchef-staging'
export const MASTERCHEF_V2_SUBGRAPH_NAME = 'sushiswap/master-chefv2'
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

export const KASHI_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/kashi-arbitrum',
}

export const DEFAULT_CHAIN_ID = ChainId.ETHEREUM
export const DEFAULT_CHAIN_NAME = CHAIN_NAME[DEFAULT_CHAIN_ID]
