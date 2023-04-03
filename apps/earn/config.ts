import { ChainId } from '@sushiswap/chain'
import { V3_FACTORY_ADDRESS, V3ChainId } from '@sushiswap/v3-sdk'

export const TRIDENT_ENABLED_NETWORKS: ChainId[] = [
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.METIS,
  ChainId.KAVA,
  ChainId.BTTC,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  // ChainId.ETHEREUM,
  // ChainId.FANTOM,
  // ChainId.GNOSIS,
]

export const AMM_ENABLED_NETWORKS: ChainId[] = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.MOONRIVER,
  ChainId.GNOSIS,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.FUSE,
  // ChainId.MOONBEAM,
  ChainId.ARBITRUM_NOVA,
  ChainId.HARMONY,
  ChainId.BOBA,
  ChainId.POLYGON,
  ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
]

export const SUPPORTED_CHAIN_IDS: ChainId[] = Array.from(
  new Set([...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS])
)

export const V3_SUPPORTED_CHAIN_IDS = Object.keys(V3_FACTORY_ADDRESS).map((el) => +el as V3ChainId)
