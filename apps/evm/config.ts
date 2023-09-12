import { ChainId, TESTNET_CHAIN_IDS } from '@sushiswap/chain'
import { TridentChainIds } from '@sushiswap/trident-sdk'
import { SushiSwapV2ChainIds } from '@sushiswap/v2-sdk'
import { SushiSwapV3ChainIds } from '@sushiswap/v3-sdk'

export const ANGLE_ENABLED_NETWORKS = [ChainId.ETHEREUM, ChainId.POLYGON, ChainId.ARBITRUM, ChainId.OPTIMISM]
export type AngleEnabledChainId = (typeof ANGLE_ENABLED_NETWORKS)[number]
export const isAngleEnabledChainId = (chainId: number): chainId is AngleEnabledChainId =>
  ANGLE_ENABLED_NETWORKS.includes(chainId as AngleEnabledChainId)

export const SWAP_API_ENABLED_NETWORKS = [
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
]
export type SwapApiEnabledChainId = (typeof SWAP_API_ENABLED_NETWORKS)[number]
export const isSwapApiEnabledChainId = (chainId: number): chainId is SwapApiEnabledChainId =>
  SWAP_API_ENABLED_NETWORKS.includes(chainId as SwapApiEnabledChainId)

export const DISABLED_CHAIN_IDS = [ChainId.HAQQ]

const PREFERRED_CHAINID_ORDER: ChainId[] = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.POLYGON,
  ChainId.OPTIMISM,
  ChainId.BSC,
  ChainId.THUNDERCORE,
  ChainId.GNOSIS,
  ChainId.AVALANCHE,
  ChainId.FANTOM,
  ChainId.ARBITRUM_NOVA,
  ChainId.HARMONY,
]

// const INCLUDED_PREFERRED_CHAIN_IDS = PREFERRED_CHAINID_ORDER.filter((el) => networks.includes(el as T))
// return Array.from(new Set([...INCLUDED_PREFERRED_CHAIN_IDS, ...networks]))

export const CHAIN_IDS = [...TridentChainIds, ...SushiSwapV2ChainIds, ...SushiSwapV3ChainIds]

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([
    ...PREFERRED_CHAINID_ORDER.filter((el) => CHAIN_IDS.includes(el as (typeof CHAIN_IDS)[number])),
    ...CHAIN_IDS,
  ])
).filter(
  (c) =>
    !TESTNET_CHAIN_IDS.includes(c as (typeof TESTNET_CHAIN_IDS)[number]) &&
    !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number])
)

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
