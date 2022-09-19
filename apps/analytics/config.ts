import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.METIS, ChainId.KAVA]

export const AMM_ENABLED_NETWORKS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.MOONRIVER,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.MOONBEAM,
  // ChainId.HARMONY,
]

export const SUPPORTED_CHAIN_IDS = [...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS]
