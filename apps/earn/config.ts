import { ChainId } from '@sushiswap/chain'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'

export const ANGLE_ENABLED_NETWORKS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM]

export const TRIDENT_ENABLED_NETWORKS = [
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
  ChainId.BOBA,
  ChainId.POLYGON,
  ChainId.BOBA_AVAX,
  ChainId.BOBA_BNB,
]

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([...AMM_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS, ...SUSHISWAP_V3_SUPPORTED_CHAIN_IDS])
).sort((a: number, b: number) => {
  // Sort Thundercore
  if (
    (
      [
        ChainId.ETHEREUM,
        ChainId.ARBITRUM,
        ChainId.POLYGON,
        ChainId.OPTIMISM,
        ChainId.AVALANCHE,
        ChainId.FANTOM,
        ChainId.BSC,
        ChainId.GNOSIS,
      ] as number[]
    ).includes(b) &&
    a === ChainId.THUNDERCORE
  )
    return 1
  if (a === ChainId.THUNDERCORE) return -1

  // Sort optimism
  if (
    ([ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.POLYGON, ChainId.OPTIMISM] as number[]).includes(b) &&
    a === ChainId.OPTIMISM
  )
    return 1
  if (a === ChainId.OPTIMISM) return -1

  return 1
})
