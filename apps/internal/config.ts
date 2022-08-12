import { ChainId } from '@sushiswap/chain'

export const BENTOBOX_ADDRESS: Record<number | string, string> = {
  [ChainId.ETHEREUM]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.POLYGON]: '0x0319000133d3AdA02600f0875d2cf03D442C3367',
  [ChainId.GNOSIS]: '0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324',
  [ChainId.BSC]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
  [ChainId.ARBITRUM]: '0x74c764D41B77DBbb4fe771daB1939B00b146894A',
  [ChainId.AVALANCHE]: '0x0711B6026068f736bae6B213031fCE978D48E026',
  [ChainId.HECO]: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
}

export const KASHI_ADDRESS: Record<number | string, string> = {
  [ChainId.ETHEREUM]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.POLYGON]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.GNOSIS]: '0x7a6DA9903d0a481F40b8336c1463487BC8C0407e',
  [ChainId.BSC]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.ARBITRUM]: '0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e',
  [ChainId.AVALANCHE]: '0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb',
  [ChainId.HECO]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
}

// "deploy-ethereum": "graph deploy --product hosted-service sushiswap/bentobox-ethereum",
// "deploy-polygon": "graph deploy --product hosted-service sushiswap/bentobox-polygon",
// "deploy-avalanche": "graph deploy --product hosted-service sushiswap/bentobox-avalanche",
// "deploy-bsc": "graph deploy --product hosted-service sushiswap/bentobox-bsc",
// "deploy-fantom": "graph deploy --product hosted-service sushiswap/bentobox-fantom",
// "deploy-gnosis": "graph deploy --product hosted-service sushiswap/bentobox-gnosis",
// "deploy-arbitrum": "graph deploy --product hosted-service sushiswap/bentobox-arbitrum",
// "deploy-celo": "graph deploy --product hosted-service sushiswap/bentobox-celo",
// "deploy-moonriver": "graph deploy --product hosted-service sushiswap/bentobox-moonriver",
// "deploy-moonbeam": "graph deploy --product hosted-service sushiswap/bentobox-moonbeam",
// "deploy-optimism": "graph deploy --product hosted-service sushiswap/bentobox-optimism",
// "deploy-harmony": "graph deploy --product hosted-service sushiswap/bentobox-harmony",
// "deploy-kava": "graph deploy --node https://pvt-admin.graph.kava.io sushiswap/bentobox-kava"

export const SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.ARBITRUM,
  ChainId.CELO,
  ChainId.MOONRIVER,
  ChainId.MOONBEAM,
  ChainId.OPTIMISM,
  ChainId.HARMONY,
  ChainId.KAVA,
]

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'
export const KAVA_HOST = 'api.thegraph.com/subgraphs/id'
export const BENTOBOX_SUBGRAPH_HOST: Record<number | string, string> = {
  [ChainId.ETHEREUM]: GRAPH_HOST,
  [ChainId.POLYGON]: GRAPH_HOST,
  [ChainId.AVALANCHE]: GRAPH_HOST,
  [ChainId.BSC]: GRAPH_HOST,
  [ChainId.FANTOM]: GRAPH_HOST,
  [ChainId.GNOSIS]: GRAPH_HOST,
  [ChainId.ARBITRUM]: PENDING_GRAPH_HOST,
  [ChainId.CELO]: GRAPH_HOST,
  [ChainId.MOONRIVER]: GRAPH_HOST,
  [ChainId.MOONBEAM]: GRAPH_HOST,
  [ChainId.OPTIMISM]: GRAPH_HOST,
  [ChainId.HARMONY]: GRAPH_HOST,
  [ChainId.KAVA]: GRAPH_HOST,
}

export const BENTOBOX_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ETHEREUM]: 'sushiswap/bentobox-ethereum',
  [ChainId.POLYGON]: 'sushiswap/bentobox-polygon',
  [ChainId.AVALANCHE]: 'sushiswap/bentobox-avalanche',
  [ChainId.BSC]: 'sushiswap/bentobox-bsc',
  [ChainId.FANTOM]: 'sushiswap/bentobox-fantom',
  [ChainId.GNOSIS]: 'sushiswap/bentobox-gnosis',
  [ChainId.ARBITRUM]: 'QmebhY9NZrt4ab3mRWbpUtqMdUSBHiVhZHFbagLQ2hT5f4',
  [ChainId.CELO]: 'sushiswap/bentobox-celo',
  [ChainId.MOONRIVER]: 'sushiswap/bentobox-moonriver',
  [ChainId.MOONBEAM]: 'sushiswap/bentobox-moonbeam',
  [ChainId.OPTIMISM]: 'sushiswap/bentobox-optimism',
  [ChainId.HARMONY]: 'sushiswap/bentobox-harmony',
  [ChainId.KAVA]: 'sushiswap/bentobox-kava',
}
export const KASHI_SUBGRAPH_NAME: Record<number | string, string> = {
  [ChainId.ARBITRUM]: 'sushiswap/kashi-arbitrum',
}
