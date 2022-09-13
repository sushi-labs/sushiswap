import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS: ChainId[] = [ChainId.OPTIMISM, ChainId.POLYGON, ChainId.KAVA, ChainId.METIS]

export const AMM_ENABLED_NETWORKS: ChainId[] = [
  ChainId.ETHEREUM,
  // ChainId.AVALANCHE,
  // ChainId.ARBITRUM,
  // ChainId.BSC,
  // ChainId.CELO,
  // ChainId.FANTOM,
  // ChainId.FUSE,
  // ChainId.GNOSIS,
  // ChainId.MOONBEAM,
  // ChainId.MOONRIVER,
  // ChainId.ARBITRUM_NOVA,
  // ChainId.HARMONY,
]

export const SUPPORTED_CHAIN_IDS = [
  // ...TRIDENT_ENABLED_NETWORKS,
  ...AMM_ENABLED_NETWORKS,
]
