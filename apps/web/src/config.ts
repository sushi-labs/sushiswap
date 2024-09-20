import { ChainId, TESTNET_CHAIN_IDS } from 'sushi/chain'
import {
  AGGREGATOR_ONLY_CHAIN_IDS,
  EXTRACTOR_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
} from 'sushi/config'

export const SWAP_API_SUPPORTED_CHAIN_IDS = EXTRACTOR_SUPPORTED_CHAIN_IDS

export type SwapApiEnabledChainId =
  (typeof SWAP_API_SUPPORTED_CHAIN_IDS)[number]
export const isSwapApiEnabledChainId = (
  chainId: number,
): chainId is SwapApiEnabledChainId =>
  SWAP_API_SUPPORTED_CHAIN_IDS.includes(chainId as SwapApiEnabledChainId)

export const DISABLED_CHAIN_IDS = [
  ChainId.BOBA_AVAX,
  ChainId.PALM,
  ChainId.HECO,
  ChainId.OKEX,
] as const

const PREFERRED_CHAINID_ORDER = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.POLYGON,
  ChainId.ROOTSTOCK,
  ChainId.BLAST,
  ChainId.ZETACHAIN,
  ChainId.SKALE_EUROPA,
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
  ...SUSHISWAP_SUPPORTED_CHAIN_IDS,
  ...AGGREGATOR_ONLY_CHAIN_IDS,
] as const

export const AMM_SUPPORTED_CHAIN_IDS = SUSHISWAP_SUPPORTED_CHAIN_IDS.filter(
  (
    c,
  ): c is Exclude<
    (typeof SUSHISWAP_SUPPORTED_CHAIN_IDS)[number],
    (typeof TESTNET_CHAIN_IDS)[number] | (typeof DISABLED_CHAIN_IDS)[number]
  > =>
    !TESTNET_CHAIN_IDS.includes(c as (typeof TESTNET_CHAIN_IDS)[number]) &&
    !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export const SUPPORTED_CHAIN_IDS = Array.from(
  new Set([
    ...PREFERRED_CHAINID_ORDER.filter((el) =>
      CHAIN_IDS.includes(el as (typeof CHAIN_IDS)[number]),
    ),
    ...CHAIN_IDS,
  ]),
).filter(
  (
    c,
  ): c is Exclude<
    (typeof CHAIN_IDS)[number],
    (typeof TESTNET_CHAIN_IDS)[number] | (typeof DISABLED_CHAIN_IDS)[number]
  > =>
    !TESTNET_CHAIN_IDS.includes(c as (typeof TESTNET_CHAIN_IDS)[number]) &&
    !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
export const isSupportedChainId = (
  chainId: number,
): chainId is SupportedChainId =>
  SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)
