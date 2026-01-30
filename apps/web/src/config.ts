import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import { ChainId } from 'sushi'
import {
  AGGREGATOR_ONLY_CHAIN_IDS,
  BLADE_SUPPORTED_CHAIN_IDS,
  type EvmAddress,
  EvmChainId,
  type EvmTestnetChainId,
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
  SWAP_API_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  isEvmTestnetChainId,
} from 'sushi/evm'
import { KvmChainId } from 'sushi/kvm'
import { MvmChainId } from 'sushi/mvm'
import { TvmChainId } from 'sushi/tvm'

export const UI_FEE_BIPS = 35
export const UI_FEE_PERCENT = UI_FEE_BIPS / 100
export const UI_FEE_DECIMAL = UI_FEE_BIPS / 10_000

export type SwapApiEnabledChainId =
  (typeof SWAP_API_SUPPORTED_CHAIN_IDS)[number]
export const isSwapApiEnabledChainId = (
  chainId: number,
): chainId is SwapApiEnabledChainId =>
  SWAP_API_SUPPORTED_CHAIN_IDS.includes(chainId as SwapApiEnabledChainId)

export const DISABLED_CHAIN_IDS = [
  ChainId.BOBA_BNB,
  ChainId.HARMONY,
  ChainId.POLYGON_ZKEVM,
  ChainId.TATARA,
  ChainId.SEPOLIA,
  ChainId.BOKUTO,
  ChainId.KADENA,
] as const

export const BLADE_SUPPORTED_NETWORKS = BLADE_SUPPORTED_CHAIN_IDS.filter(
  (c) => !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export const NEW_CHAIN_IDS = [EvmChainId.MEGAETH, EvmChainId.XLAYER] as const

export const PREFERRED_CHAINID_ORDER = [
  ...NEW_CHAIN_IDS,
  ChainId.HEMI,
  ChainId.ETHEREUM,
  ChainId.KATANA,
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.POLYGON,
  ChainId.LINEA,
  ChainId.BSC,
  ChainId.OPTIMISM,
  ChainId.FILECOIN,
  ChainId.ROOTSTOCK,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.SKALE_EUROPA,
  ChainId.CELO,
  ChainId.HAQQ,
  ChainId.TRON,
  ChainId.SCROLL,
  ChainId.THUNDERCORE,
  ChainId.ARBITRUM_NOVA,
  ChainId.APTOS,
  ChainId.AVALANCHE,
  ChainId.SONIC,
  ChainId.CORE,
  ChainId.BLAST,
  ChainId.ZETACHAIN,
  ChainId.BOBA,
  ChainId.MANTLE,
  ChainId.HYPEREVM,
  ChainId.BERACHAIN,
  ChainId.MEGAETH,
  ChainId.PLASMA,
  ChainId.MONAD,
  ChainId.XLAYER,
  ChainId.CRONOS,
  ChainId.MODE,
  ChainId.KAVA,
  ChainId.ZKSYNC_ERA,
  ChainId.METIS,
  ChainId.MANTA,
  ChainId.ZKLINK,
  ChainId.APE,
  ChainId.POLYGON_ZKEVM,
  ChainId.TAIKO,
  ChainId.HARMONY,
] as const

export const getSortedChainIds = <T extends ChainId>(
  chainIds: readonly T[],
) => {
  return Array.from(
    new Set([
      ...(PREFERRED_CHAINID_ORDER.filter((el) =>
        chainIds.includes(el as (typeof chainIds)[number]),
      ) as T[]),
      ...chainIds,
    ]),
  )
}

export const CHAIN_IDS = [
  ...SUSHISWAP_SUPPORTED_CHAIN_IDS,
  ...AGGREGATOR_ONLY_CHAIN_IDS,
] as const

export const AMM_SUPPORTED_CHAIN_IDS = SUSHISWAP_SUPPORTED_CHAIN_IDS.filter(
  (
    c,
  ): c is Exclude<
    (typeof SUSHISWAP_SUPPORTED_CHAIN_IDS)[number],
    EvmTestnetChainId | (typeof DISABLED_CHAIN_IDS)[number]
  > =>
    !isEvmTestnetChainId(c as EvmTestnetChainId) &&
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
    EvmTestnetChainId | (typeof DISABLED_CHAIN_IDS)[number]
  > =>
    !isEvmTestnetChainId(c as EvmTestnetChainId) &&
    !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
export const isSupportedChainId = (
  chainId: number,
): chainId is SupportedChainId =>
  SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)

const UNSORTED_SUPPORTED_NETWORKS = [
  ...SUPPORTED_CHAIN_IDS,
  MvmChainId.APTOS,
  TvmChainId.TRON,
  KvmChainId.KADENA,
].filter(
  (c) => !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export const SUPPORTED_NETWORKS = Array.from(
  new Set([
    ...PREFERRED_CHAINID_ORDER.filter((el) =>
      UNSORTED_SUPPORTED_NETWORKS.includes(
        el as (typeof UNSORTED_SUPPORTED_NETWORKS)[number],
      ),
    ),
    ...UNSORTED_SUPPORTED_NETWORKS,
  ]),
)

const UNSORTED_POOL_SUPPORTED_NETWORKS = [
  ...PoolChainIds,
  MvmChainId.APTOS,
  TvmChainId.TRON,
  KvmChainId.KADENA,
].filter(
  (c) => !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export const POOL_SUPPORTED_NETWORKS = Array.from(
  new Set([
    ...PREFERRED_CHAINID_ORDER.filter((el) =>
      UNSORTED_POOL_SUPPORTED_NETWORKS.includes(
        el as (typeof UNSORTED_POOL_SUPPORTED_NETWORKS)[number],
      ),
    ),
    ...UNSORTED_POOL_SUPPORTED_NETWORKS,
  ]),
)

export const TWAP_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.ETHEREUM,
  ChainId.KATANA,
] as const

export type TwapSupportedChainId = (typeof TWAP_SUPPORTED_CHAIN_IDS)[number]
export const isTwapSupportedChainId = (
  chainId: number,
): chainId is TwapSupportedChainId =>
  TWAP_SUPPORTED_CHAIN_IDS.includes(chainId as TwapSupportedChainId)

export const ZAP_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.POLYGON,
  ChainId.BASE,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.KATANA,
  ChainId.SONIC,
  ChainId.LINEA,
] as const

export type ZapSupportedChainId = (typeof ZAP_SUPPORTED_CHAIN_IDS)[number]
export const isZapSupportedChainId = (
  chainId: number,
): chainId is ZapSupportedChainId =>
  ZAP_SUPPORTED_CHAIN_IDS.includes(chainId as ZapSupportedChainId)

export const XSWAP_SUPPORTED_CHAIN_IDS = [
  ChainId.APE,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BASE,
  ChainId.BERACHAIN,
  ChainId.BLAST,
  ChainId.BOBA,
  ChainId.BSC,
  ChainId.CELO,
  ChainId.CRONOS,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  // ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.HEMI,
  ChainId.HYPEREVM,
  ChainId.KATANA,
  ChainId.LINEA,
  ChainId.MANTLE,
  ChainId.METIS,
  ChainId.MODE,
  // ChainId.MOONBEAM,
  // ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.PLASMA,
  ChainId.POLYGON,
  // ChainId.POLYGON_ZKEVM,
  ChainId.ROOTSTOCK,
  ChainId.SCROLL,
  ChainId.SONIC,
  ChainId.TAIKO,
  ChainId.ZKSYNC_ERA,
] as const

export type XSwapSupportedChainId = (typeof XSWAP_SUPPORTED_CHAIN_IDS)[number]
export const isXSwapSupportedChainId = (
  chainId: number,
): chainId is XSwapSupportedChainId =>
  XSWAP_SUPPORTED_CHAIN_IDS.includes(chainId as XSwapSupportedChainId)

export const SUSHISWAP_V3_POSITION_HELPER: Record<
  SushiSwapV3ChainId,
  EvmAddress
> = {
  [ChainId.ARBITRUM_NOVA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.ARBITRUM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.AVALANCHE]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BSC]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BTTC]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  // [ChainId.CELO]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.ETHEREUM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.FANTOM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.GNOSIS]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.KAVA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.METIS]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.OPTIMISM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.POLYGON]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BOBA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.THUNDERCORE]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.HAQQ]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.CORE]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.LINEA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BASE]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.SCROLL]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.FILECOIN]: '0xc85C59A05EC888aa055Ec3b3A7263d173cc6E111',
  [ChainId.ZETACHAIN]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BLAST]: '0xc85C59A05EC888aa055Ec3b3A7263d173cc6E111',
  [ChainId.SKALE_EUROPA]: '0x4f6086BC5bd944080EFA6Eb54f11E2b6229e7333',
  [ChainId.ROOTSTOCK]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.SONIC]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.HEMI]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.KATANA]: '0xc85C59A05EC888aa055Ec3b3A7263d173cc6E111',
  [ChainId.TATARA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.SEPOLIA]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  [ChainId.BOKUTO]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  // DEPRECATED
  // [ChainId.FUSE]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  // [ChainId.MOONBEAM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  // [ChainId.MOONRIVER]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
  // [ChainId.POLYGON_ZKEVM]: '0x34026A9b9Cb6DF84880C4B2f778F5965F5679c16',
} as const
