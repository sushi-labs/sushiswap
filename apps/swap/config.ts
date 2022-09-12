import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.KAVA, ChainId.METIS]

export const AMM_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.ARBITRUM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FANTOM,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
]

export const SUPPORTED_CHAIN_IDS = [...TRIDENT_ENABLED_NETWORKS, ...AMM_ENABLED_NETWORKS]
