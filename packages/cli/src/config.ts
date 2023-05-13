import { ChainId, ChainKey } from '@sushiswap/chain'
import { FURO_SUBGRAPH_NAME } from '@sushiswap/graph-config'

export const WETH_MAKER_SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
] as const

export const MAKER_SUPPORTED_CHAIN_NAMES = [
  ChainKey[ChainId.ETHEREUM],
  ChainKey[ChainId.FANTOM],
  ChainKey[ChainId.POLYGON],
  ChainKey[ChainId.GNOSIS],
  ChainKey[ChainId.BSC],
  ChainKey[ChainId.ARBITRUM],
  ChainKey[ChainId.AVALANCHE],
  ChainKey[ChainId.CELO],
  ChainKey[ChainId.MOONBEAM],
  ChainKey[ChainId.MOONRIVER],
  ChainKey[ChainId.FUSE],
  ChainKey[ChainId.HARMONY],
] as const

export const REVENUES_SUPPORTED_CHAIN_NAMES = [
  ChainKey[ChainId.ETHEREUM],
  ChainKey[ChainId.OPTIMISM],
  ChainKey[ChainId.GNOSIS],
  ChainKey[ChainId.POLYGON],
  ChainKey[ChainId.ARBITRUM],
  //ChainKey.ARBITRUM_NOVA,
  ChainKey[ChainId.BSC],
  ChainKey[ChainId.AVALANCHE],
  //ChainKey.BTTC,
  ChainKey[ChainId.FANTOM],
  ChainKey[ChainId.BOBA],
  ChainKey[ChainId.METIS],
  ChainKey[ChainId.MOONRIVER],
  ChainKey[ChainId.KAVA],
  ChainKey[ChainId.CELO],
  ChainKey[ChainId.HARMONY],
] as const

export const FURO_SUPPORTED_CHAIN_NAMES = Object.keys(FURO_SUBGRAPH_NAME)
  .filter((key) => {
    return Number(key) !== ChainId.GÖRLI
  })
  .map((key) => ChainId[Number(key)].toLowerCase())

export const CHAIN_NAME_TO_CHAIN_ID = {
  [ChainKey[ChainId.ETHEREUM]]: ChainId.ETHEREUM,
  [ChainKey[ChainId.FANTOM]]: ChainId.FANTOM,
  [ChainKey[ChainId.POLYGON]]: ChainId.POLYGON,
  [ChainKey[ChainId.GNOSIS]]: ChainId.GNOSIS,
  [ChainKey[ChainId.BSC]]: ChainId.BSC,
  [ChainKey[ChainId.ARBITRUM]]: ChainId.ARBITRUM,
  [ChainKey[ChainId.AVALANCHE]]: ChainId.AVALANCHE,
  [ChainKey[ChainId.CELO]]: ChainId.CELO,
  [ChainKey[ChainId.MOONBEAM]]: ChainId.MOONBEAM,
  [ChainKey[ChainId.MOONRIVER]]: ChainId.MOONRIVER,
  [ChainKey[ChainId.FUSE]]: ChainId.FUSE,
  [ChainKey[ChainId.HARMONY]]: ChainId.HARMONY,
} as const

export const MAKER_TYPE = {
  [ChainId.ETHEREUM]: 'SushiMaker',
  [ChainId.FANTOM]: 'Safe',
  [ChainId.POLYGON]: 'WethMaker',
  [ChainId.GNOSIS]: 'Safe',
  [ChainId.BSC]: 'Safe',
  [ChainId.ARBITRUM]: 'WethMaker',
  [ChainId.AVALANCHE]: 'WethMaker',
  [ChainId.CELO]: 'Safe',
  [ChainId.MOONBEAM]: 'Safe',
  [ChainId.MOONRIVER]: 'Deployer',
  [ChainId.FUSE]: 'Safe',
  [ChainId.HARMONY]: 'Deployer',
} as const

export const MAKER_ADDRESS = {
  [ChainId.ETHEREUM]: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277',
  [ChainId.FANTOM]: '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52',
  [ChainId.POLYGON]: '0xf1c9881be22ebf108b8927c4d197d126346b5036',
  [ChainId.GNOSIS]: '0xc375411c6597f692add6a7a3ad5b3c38626b0f26',
  [ChainId.BSC]: '0xc6fd91ad4919fd91e2c84077ba648092cb499638',
  [ChainId.ARBITRUM]: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
  [ChainId.AVALANCHE]: '0x560c759a11cd026405f6f2e19c65da1181995fa2',
  [ChainId.CELO]: '0x8b63fcbb752e425e3c4b12f7802bad1a24c6d7f4',
  [ChainId.MOONBEAM]: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3',
  [ChainId.MOONRIVER]: '0xcc159bcb6a466da442d254ad934125f05dab66b5',
  [ChainId.FUSE]: '0x33b6beb37837459ee84a1ffed2c6a4ca22e5f316',
  [ChainId.HARMONY]: '0xcc159bcb6a466da442d254ad934125f05dab66b5',
} as const

// [ChainKey.MOONBEAM]: {address: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3', type: "Safe"}, // Disabled, reserveUSD returns 0
// [ChainKey.HARMONY]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // inconsistent uptime, not hosted by thegraph

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'
export const KAVA_GRAPH_HOST = 'https://pvt.graph.kava.io/subgraphs/name'
export const METIS_GRAPH_HOST = 'https://andromeda.thegraph.metis.io/subgraphs/name'

export const SUBGRAPH_HOST = {
  [ChainId.ARBITRUM]: GRAPH_HOST,
  [ChainId.AVALANCHE]: GRAPH_HOST,
  [ChainId.BSC]: GRAPH_HOST,
  [ChainId.CELO]: GRAPH_HOST,
  [ChainId.ETHEREUM]: GRAPH_HOST,
  [ChainId.FANTOM]: GRAPH_HOST,
  [ChainId.FUSE]: GRAPH_HOST,
  [ChainId.GNOSIS]: GRAPH_HOST,
  [ChainId.GÖRLI]: GRAPH_HOST,
  [ChainId.HARMONY]: GRAPH_HOST,
  [ChainId.MOONBEAM]: GRAPH_HOST,
  [ChainId.MOONRIVER]: GRAPH_HOST,
  [ChainId.OPTIMISM]: GRAPH_HOST,
  [ChainId.POLYGON]: GRAPH_HOST,
  [ChainId.BOBA]: GRAPH_HOST,
  [ChainId.KAVA]: KAVA_GRAPH_HOST,
  [ChainId.METIS]: METIS_GRAPH_HOST,
} as const

export const EXCHANGE_SUBGRAPH_NAME = {
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ETHEREUM]: 'sushiswap/exchange',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.GNOSIS]: 'sushiswap/exchange-gnosis',
  [ChainId.HARMONY]: 'sushiswap/exchange-harmony',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
} as const

export const TRIDENT_SUBGRAPH_NAME = {
  [ChainId.POLYGON]: 'sushi-v2/trident-polygon',
  [ChainId.OPTIMISM]: 'sushi-qa/trident-optimism',
  [ChainId.KAVA]: 'sushi-qa/trident-kava',
  [ChainId.METIS]: 'sushi-qa/trident-metis',
  [ChainId.BOBA]: 'sushi-qa/trident-metis',
} as const
