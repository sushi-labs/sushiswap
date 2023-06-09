import { ChainId } from '@sushiswap/chain'

export const TRIDENT_ENABLED_NETWORKS: ChainId[] = [
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.METIS,
  // ChainId.KAVA,
  ChainId.BTTC,
  ChainId.ARBITRUM,
]

export const AMM_ENABLED_NETWORKS = [
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
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
  ChainId.THUNDERCORE,
  ChainId.POLYGON_ZKEVM,
]

export const SUPPORTED_CHAIN_IDS = Array.from(new Set([...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS]))
