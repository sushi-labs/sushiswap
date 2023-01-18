import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS = [
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.METIS,
  ChainId.KAVA,
  ChainId.BTTC,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
] as const

export const AMM_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.MOONRIVER,
  ChainId.ARBITRUM_NOVA,
  ChainId.FUSE,
  ChainId.CELO,
  ChainId.MOONBEAM,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.OKEX,
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.HARMONY,
] as const

export const SUPPORTED_CHAIN_IDS = Array.from(new Set([...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS]))

export type SupportedChainId = typeof SUPPORTED_CHAIN_IDS[number]
