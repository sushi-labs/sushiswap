import { ChainId } from '@sushiswap/chain'

export enum ProtocolVersion {
  V2 = 'V2',
  LEGACY = 'LEGACY',
  TRIDENT = 'TRIDENT',
  V3 = 'V3',
}

export enum ProtocolName {
  SUSHISWAP = 'SushiSwap',
  UNISWAP = 'Uniswap',
  PANCAKESWAP = 'PancakeSwap',
  QUICKSWAP = 'QuickSwap',
  TRADERJOE = 'TraderJoe',
  SPOOKYSWAP = 'SpookySwap',
  UBESWAP = 'UbeSwap',
  HONEYSWAP = 'HoneySwap',
  NETSWAP = 'NetSwap',
  APESWAP = 'ApeSwap',
  JETSWAP = 'JetSwap',
  DFYN = 'Dfyn',
  ELK = 'Elk',
  SPIRITSWAP = 'SpiritSwap',
}

export enum PoolType {
  CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL',
  STABLE_POOL = 'STABLE_POOL',
  CONCENTRATED_LIQUIDITY_POOL = 'CONCENTRATED_LIQUIDITY_POOL',
}

export enum Price {
  USD = 'USD',
  NATIVE = 'NATIVE',
}

export const TRACKED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.MOONRIVER,
  ChainId.GNOSIS,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.MOONBEAM,
  ChainId.ARBITRUM_NOVA,
  ChainId.HARMONY,
  ChainId.POLYGON,
  ChainId.OPTIMISM,
  ChainId.METIS,
  ChainId.KAVA,
  ChainId.BTTC,
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
]

export const PROTOCOL_JOBS: ProtocolJob[] = [
  { protocol: ProtocolName.SUSHISWAP },
  { protocol: ProtocolName.UNISWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.PANCAKESWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.QUICKSWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.TRADERJOE, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.SPOOKYSWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.UBESWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.HONEYSWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.NETSWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.APESWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.JETSWAP, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.DFYN, version: ProtocolVersion.V2 },
  { protocol: ProtocolName.ELK, version: ProtocolVersion.V2 },
]

interface ProtocolJob {
  protocol: ProtocolName
  version?: ProtocolVersion
  poolType?: PoolType
}

export const GRAPH_HOST_ENDPOINT = 'api.thegraph.com'
export const SUSHI_HOST_ENDPOINT = 'subgraphs.sushi.com'
