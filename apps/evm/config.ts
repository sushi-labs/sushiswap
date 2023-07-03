import { ChainId, TESTNET_CHAIN_IDS } from '@sushiswap/chain'
import { TridentChainIds } from '@sushiswap/trident-sdk'
import { SushiSwapV2ChainIds } from '@sushiswap/v2-sdk'
import { SushiSwapV3ChainIds } from '@sushiswap/v3-sdk'

export const ANGLE_ENABLED_NETWORKS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM]

export type AngleEnabledChainId = (typeof ANGLE_ENABLED_NETWORKS)[number]

export const SWAP_API_ENABLED_NETWORKS = []

export type SwapApiEnabledChainId = (typeof SWAP_API_ENABLED_NETWORKS)[number]

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([...TridentChainIds, ...SushiSwapV2ChainIds, ...SushiSwapV3ChainIds])
)
  .filter((c) => !TESTNET_CHAIN_IDS.includes(c as (typeof TESTNET_CHAIN_IDS)[number]))
  .sort((a: number, b: number) => {
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

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
