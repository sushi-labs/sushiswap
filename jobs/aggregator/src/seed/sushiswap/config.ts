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
    [ChainId.BOBA_BNB]: SUSHI_HOST_ENDPOINT,
    [ChainId.BOBA_AVAX]: SUSHI_HOST_ENDPOINT,
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
    ChainId.BOBA_BNB,
    ChainId.BOBA_AVAX,
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
    [ChainId.ETHEREUM]: 'sushi-v2/sushiswap-ethereum',
    [ChainId.AVALANCHE]: 'sushi-v2/sushiswap-avalanche',
    [ChainId.ARBITRUM]: 'sushi-v2/sushiswap-arbitrum',
    [ChainId.BSC]: 'sushi-v2/sushiswap-bsc',
    [ChainId.CELO]: 'sushi-v2/sushiswap-celo',
    [ChainId.FANTOM]: 'sushi-v2/sushiswap-fantom',
    [ChainId.FUSE]: 'sushi-v2/sushiswap-fuse',
    [ChainId.GNOSIS]: 'sushi-v2/sushiswap-gnosis',
    [ChainId.MOONBEAM]: 'sushi-v2/sushiswap-moonbeam',
    [ChainId.MOONRIVER]: 'sushi-v2/sushiswap-moonriver',
    [ChainId.POLYGON]: 'sushi-v2/sushiswap-polygon',
    [ChainId.BOBA]: 'sushi-v2/sushiswap-boba',
    [ChainId.HARMONY]: 'olastenberg/sushiswap-harmony-fix',
    [ChainId.ARBITRUM_NOVA]: 'sushi-0m/sushiswap-arbitrum-nova',
    [ChainId.BOBA_BNB]: 'sushi-0m/sushiswap-boba-bnb',
    [ChainId.BOBA_AVAX]: 'sushi-0m/sushiswap-boba-avax',
  }
  
  export const TRIDENT_SUBGRAPH_NAME: Record<number | string, string> = {
    [ChainId.POLYGON]: 'sushi-v2/trident-polygon',
    [ChainId.OPTIMISM]: 'sushi-v2/trident-optimism',
    [ChainId.ARBITRUM]: 'sushi-v2/trident-arbitrum',
    [ChainId.AVALANCHE]: 'sushi-v2/trident-avalanche',
    [ChainId.BSC]: 'sushi-v2/trident-bsc',
    [ChainId.METIS]: 'sushi-qa/trident-metis',
    [ChainId.KAVA]: 'sushi-qa/trident-kava',
    [ChainId.BTTC]: 'sushi-qa/trident-bttc',
  }
  
  export const SUSHI_SUPPORTED_CHAINS = Array.from(new Set([...SUSHISWAP_CHAINS, ...TRIDENT_CHAINS]))