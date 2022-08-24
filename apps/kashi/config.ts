import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAIN_IDS = [ChainId.ARBITRUM]

export const KASHI_ADDRESS: Record<number | string, string> = {
  [ChainId.ETHEREUM]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.POLYGON]: '0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7',
  [ChainId.GNOSIS]: '0x7a6DA9903d0a481F40b8336c1463487BC8C0407e',
  [ChainId.BSC]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
  [ChainId.ARBITRUM]: '0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e',
  [ChainId.AVALANCHE]: '0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb',
  [ChainId.HECO]: '0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42',
}

export const GRAPH_HOST = 'api.thegraph.com/subgraphs/name'
export const PENDING_GRAPH_HOST = 'api.thegraph.com/subgraphs/id'
export const KAVA_HOST = 'api.thegraph.com/subgraphs/id'

export const CHAIN_NAME: Record<number | string, string> = {
  [ChainId.POLYGON]: 'Polygon',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.ARBITRUM]: 'Arbitrum',
}

export const KASHI_SUBGRAPH_HOST: Record<number | string, string> = {
  [ChainId.POLYGON]: GRAPH_HOST,
  [ChainId.ARBITRUM]: GRAPH_HOST,
}

export const KASHI_SUBGRAPH_NAME: Record<number | string, string> = {
  // [ChainId.POLYGON]: 'sushiswap/kashi-polygon',
  [ChainId.ARBITRUM]: 'sushi-labs/kashi-arbitrum',
}
