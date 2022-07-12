import { ChainId, ChainKey } from '@sushiswap/chain'

export const MAKER_SUPPORTED_CHAIN_NAMES = [
  ChainKey.ETHEREUM,
  ChainKey.FANTOM,
  ChainKey.POLYGON,
  ChainKey.GNOSIS,
  ChainKey.BSC,
  ChainKey.ARBITRUM,
  ChainKey.AVALANCHE,
  ChainKey.CELO,
  ChainKey.MOONBEAM,
  ChainKey.MOONRIVER,
  ChainKey.FUSE,
  ChainKey.HARMONY,
]

export const CHAIN_NAME_TO_CHAIN_ID: Record<string, string | number> = {
  [ChainKey.ETHEREUM]: ChainId.ETHEREUM,
  [ChainKey.FANTOM]: ChainId.FANTOM,
  [ChainKey.POLYGON]: ChainId.POLYGON,
  [ChainKey.GNOSIS]: ChainId.GNOSIS,
  [ChainKey.BSC]: ChainId.BSC,
  [ChainKey.ARBITRUM]: ChainId.ARBITRUM,
  [ChainKey.AVALANCHE]: ChainId.AVALANCHE,
  [ChainKey.CELO]: ChainId.CELO,
  [ChainKey.MOONBEAM]: ChainId.MOONBEAM,
  [ChainKey.MOONRIVER]: ChainId.MOONRIVER,
  [ChainKey.FUSE]: ChainId.FUSE,
  [ChainKey.HARMONY]: ChainId.HARMONY,
}

export const MAKER_TYPE: Record<string, string> = {
  [ChainKey.ETHEREUM]: 'SushiMaker',
  [ChainKey.FANTOM]: 'Safe',
  [ChainKey.POLYGON]: 'WethMaker',
  [ChainKey.GNOSIS]: 'Safe',
  [ChainKey.BSC]: 'Safe',
  [ChainKey.ARBITRUM]: 'WethMaker',
  [ChainKey.AVALANCHE]: 'WethMaker',
  [ChainKey.CELO]: 'Safe',
  [ChainKey.MOONBEAM]: 'Safe',
  [ChainKey.MOONRIVER]: 'Deployer',
  [ChainKey.FUSE]: 'Safe',
  [ChainKey.HARMONY]: 'Deployer',
}

export const MAKER_ADDRESS: Record<string, string> = {
  [ChainKey.ETHEREUM]: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277',
  [ChainKey.FANTOM]: '0xf9e7d4c6d36ca311566f46c81e572102a2dc9f52',
  [ChainKey.POLYGON]: '0xf1c9881be22ebf108b8927c4d197d126346b5036',
  [ChainKey.GNOSIS]: '0xc375411c6597f692add6a7a3ad5b3c38626b0f26',
  [ChainKey.BSC]: '0xc6fd91ad4919fd91e2c84077ba648092cb499638',
  [ChainKey.ARBITRUM]: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
  [ChainKey.AVALANCHE]: '0x560c759a11cd026405f6f2e19c65da1181995fa2',
  [ChainKey.CELO]: '0x8b63fcbb752e425e3c4b12f7802bad1a24c6d7f4',
  [ChainKey.MOONBEAM]: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3',
  [ChainKey.MOONRIVER]: '0xcc159bcb6a466da442d254ad934125f05dab66b5',
  [ChainKey.FUSE]: '0x33b6beb37837459ee84a1ffed2c6a4ca22e5f316',
  [ChainKey.HARMONY]: '0xcc159bcb6a466da442d254ad934125f05dab66b5',
}

// [ChainKey.MOONBEAM]: {address: '0x87aeb22b7bb02ac42204eb312c08a22fc3f077f3', type: "Safe"}, // Disabled, reserveUSD returns 0
// [ChainKey.HARMONY]: {address: '0xcc159bcb6a466da442d254ad934125f05dab66b5', type: "Matt"}, // inconsistent uptime, not hosted by thegraph

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'

export const SUBGRAPH_HOST: Record<number | string, string> = {
  [ChainId.ARBITRUM]: GRAPH_HOST,
  [ChainId.AVALANCHE]: GRAPH_HOST,
  [ChainId.BSC]: GRAPH_HOST,
  [ChainId.ETHEREUM]: GRAPH_HOST,
  [ChainId.FANTOM]: GRAPH_HOST,
  [ChainId.GNOSIS]: GRAPH_HOST,
  [ChainId.GÖRLI]: GRAPH_HOST,
  [ChainId.HARMONY]: GRAPH_HOST,
  [ChainId.MOONBEAM]: GRAPH_HOST,
  [ChainId.MOONRIVER]: GRAPH_HOST,
  [ChainId.OPTIMISM]: GRAPH_HOST,
  [ChainId.POLYGON]: GRAPH_HOST,
}

export const EXCHANGE_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.AVALANCHE]: 'sushiswap/exchange-avalanche',
  [ChainId.ARBITRUM]: 'sushiswap/exchange-arbitrum-backup',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
  [ChainId.CELO]: 'sushiswap/exchange-celo',
  [ChainId.ETHEREUM]: 'sushiswap/exchange-ethereum',
  [ChainId.FANTOM]: 'sushiswap/exchange-fantom',
  [ChainId.FUSE]: 'sushiswap/exchange-fuse',
  [ChainId.GNOSIS]: 'sushiswap/exchange-gnosis',
  [ChainId.MOONBEAM]: 'sushiswap/exchange-moonbeam',
  [ChainId.MOONRIVER]: 'sushiswap/exchange-moonriver',
  [ChainId.POLYGON]: 'sushiswap/matic-exchange',
  [ChainId.HARMONY]: 'sushiswap/exchange-harmony',
}
