import { ChainId } from "@sushiswap/chain"

import { GRAPH_HOST_ENDPOINT, SUSHI_HOST_ENDPOINT } from "../../config.js"

export const GRAPH_HOST: Record<number | string, string> = {
    [ChainId.OPTIMISM]: GRAPH_HOST_ENDPOINT,
    [ChainId.ETHEREUM]: GRAPH_HOST_ENDPOINT,
    [ChainId.AVALANCHE]: GRAPH_HOST_ENDPOINT,
    [ChainId.ARBITRUM]: GRAPH_HOST_ENDPOINT,
    [ChainId.BSC]: GRAPH_HOST_ENDPOINT,
    [ChainId.CELO]: GRAPH_HOST_ENDPOINT,
    [ChainId.FANTOM]: GRAPH_HOST_ENDPOINT,
    [ChainId.FUSE]: GRAPH_HOST_ENDPOINT,
    [ChainId.GNOSIS]: GRAPH_HOST_ENDPOINT,
    [ChainId.MOONBEAM]: GRAPH_HOST_ENDPOINT,
    [ChainId.MOONRIVER]: GRAPH_HOST_ENDPOINT,
    [ChainId.HARMONY]: GRAPH_HOST_ENDPOINT,
    [ChainId.POLYGON]: GRAPH_HOST_ENDPOINT,
    [ChainId.KAVA]: 'pvt.graph.kava.io',
    [ChainId.METIS]: 'andromeda.thegraph.metis.io',
    [ChainId.ARBITRUM_NOVA]: SUSHI_HOST_ENDPOINT,
    [ChainId.BOBA]: GRAPH_HOST_ENDPOINT,
    [ChainId.BTTC]: SUSHI_HOST_ENDPOINT,
  }
  
  // SUSHISWAP
  export const SUSHISWAP_CHAINS = [
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
  ]
  
  export const TRIDENT_CHAINS = [
    ChainId.POLYGON,
    ChainId.OPTIMISM,
    ChainId.METIS,
    ChainId.KAVA,
    ChainId.ARBITRUM,
    ChainId.AVALANCHE,
    ChainId.BSC,
    ChainId.BTTC,
  ]
  
  export const LEGACY_SUBGRAPH_NAME: Record<number | string, string> = {
    [ChainId.ETHEREUM]: 'sushiswap-subgraphs/sushiswap-ethereum',
    [ChainId.AVALANCHE]: 'sushi-0m/sushiswap-avalanche',
    [ChainId.ARBITRUM]: 'sushi-0m/sushiswap-arbitrum',
    [ChainId.BSC]: 'subgraph-qa/sushiswap-bsc',
    [ChainId.CELO]: 'sushi-0m/sushiswap-celo',
    [ChainId.FANTOM]: 'sushi-0m/sushiswap-fantom',
    [ChainId.FUSE]: 'sushi-0m/sushiswap-fuse',
    [ChainId.GNOSIS]: 'sushi-0m/sushiswap-gnosis',
    [ChainId.MOONBEAM]: 'sushi-0m/sushiswap-moonbeam',
    [ChainId.MOONRIVER]: 'sushi-0m/sushiswap-moonriver',
    [ChainId.HARMONY]: 'olastenberg/sushiswap-harmony-fix',
    [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
    // [ChainId.BOBA_AVAX]: 'sushi-0m/sushiswap-boba-avax',
    [ChainId.POLYGON]: 'subgraph-qa/sushiswap-polygon',
    [ChainId.BOBA]: 'sushi-0m/sushiswap-boba',
  }
  
  export const TRIDENT_SUBGRAPH_NAME: Record<number | string, string> = {
    [ChainId.POLYGON]: 'sushi-qa/trident-polygon',
    [ChainId.OPTIMISM]: 'sushi-qa/trident-optimism',
    [ChainId.METIS]: 'sushi-qa/trident-metis',
    [ChainId.KAVA]: 'sushi-qa/trident-kava',
    [ChainId.ARBITRUM]: 'sushi-qa/trident-arbitrum',
    [ChainId.AVALANCHE]: 'sushi-qa/trident-avalanche',
    [ChainId.BSC]: 'sushi-qa/trident-bsc',
    [ChainId.BTTC]: 'sushi-qa/trident-bttc',
  }
  
  export const SUSHI_SUPPORTED_CHAINS = Array.from(new Set([...SUSHISWAP_CHAINS, ...TRIDENT_CHAINS]))