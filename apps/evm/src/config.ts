import { TridentChainIds } from '@sushiswap/trident-sdk'
import { SushiSwapV2ChainIds } from '@sushiswap/v2-sdk'
import { SushiSwapV3ChainIds } from '@sushiswap/v3-sdk'
import { ChainId, TESTNET_CHAIN_IDS } from 'sushi/chain'
import { Currency } from 'sushi/currency'

export const SWAP_API_ENABLED_NETWORKS = [
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.SCROLL,
  ChainId.LINEA,
  ChainId.HAQQ,
]
export type SwapApiEnabledChainId = typeof SWAP_API_ENABLED_NETWORKS[number]
export const isSwapApiEnabledChainId = (
  chainId: number,
): chainId is SwapApiEnabledChainId =>
  SWAP_API_ENABLED_NETWORKS.includes(chainId as SwapApiEnabledChainId)

export const DISABLED_CHAIN_IDS = [ChainId.BOBA_AVAX] as const

const PREFERRED_CHAINID_ORDER = [
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
] as const

export const CHAIN_IDS = [
  ...TridentChainIds,
  ...SushiSwapV2ChainIds,
  ...SushiSwapV3ChainIds,
] as const

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([
    ...PREFERRED_CHAINID_ORDER.filter((el) =>
      CHAIN_IDS.includes(el as typeof CHAIN_IDS[number]),
    ),
    ...CHAIN_IDS,
  ]),
).filter(
  (
    c,
  ): c is Exclude<
    typeof CHAIN_IDS[number],
    typeof TESTNET_CHAIN_IDS[number] | typeof DISABLED_CHAIN_IDS[number]
  > =>
    !TESTNET_CHAIN_IDS.includes(c as typeof TESTNET_CHAIN_IDS[number]) &&
    !DISABLED_CHAIN_IDS.includes(c as typeof DISABLED_CHAIN_IDS[number]),
)

export const DISABLED_ANALYTICS_CHAIN_IDS = [
  ChainId.BOBA_AVAX,
  ChainId.KAVA,
  ChainId.MOONRIVER,
]

export const ANALYTICS_CHAIN_IDS = [
  ...SUPPORTED_CHAIN_IDS.filter(
    (el) =>
      !DISABLED_ANALYTICS_CHAIN_IDS.includes(
        el as typeof DISABLED_ANALYTICS_CHAIN_IDS[number],
      ),
  ),
]

export type SupportedChainId = typeof SUPPORTED_CHAIN_IDS[number]
export const isSupportedChainId = (
  chainId: number,
): chainId is SupportedChainId =>
  SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)

export type Config = {
  [_chainId in SupportedChainId]: {
    stables: Currency[]
    lsds: Currency[]
  }
}

export const config = {
  [ChainId.ETHEREUM]: {},
}
