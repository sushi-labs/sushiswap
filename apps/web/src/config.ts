import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import { ChainId } from 'sushi'
import {
  AGGREGATOR_ONLY_CHAIN_IDS,
  BLADE_SUPPORTED_CHAIN_IDS,
  EvmChainId,
  type EvmTestnetChainId,
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
  SWAP_API_SUPPORTED_CHAIN_IDS,
  isEvmTestnetChainId,
} from 'sushi/evm'
import { MvmChainId } from 'sushi/mvm'
import {
  SVM_USDC,
  SVM_USDT,
  SvmChainId,
  SvmToken,
  WSOL,
  isSvmChainId,
  svmAddress,
} from 'sushi/svm'

export const ULTRA_ADVANCED_FEE_RECEIVER =
  'FR7r4C5prSywpsTkd1jutJ6nxDyo25hgAkwHR6HKnNjU'
export const ULTRA_ADVANCED_FEE_INTEGRATOR_ID = 'tyler@sushi.com'
//@dev: ULTRA_ADVANCED_FEE_RECEIVER must have an ATA created for the fee mint to be used here, can just send a token to the address and an ATA will automatically be created
export const ULTRA_FEE_MINT_OPTIONS = [
  { currency: SVM_USDC[SvmChainId.SOLANA], priority: 100 },
  { currency: SVM_USDT[SvmChainId.SOLANA], priority: 95 },
  {
    currency: new SvmToken({
      address: svmAddress('JuprjznTrTSp2UFa3ZBUFgwdAmtZCq4MQCwysN55USD'),
      name: 'Jupiter USD',
      symbol: 'JupUSD',
      decimals: 6,
      chainId: SvmChainId.SOLANA,
    }),
    priority: 90,
  },
  {
    currency: WSOL[SvmChainId.SOLANA], //fees will be sent in SOL when using WSOL
    priority: 85,
    shouldUseNativeForBalanceCheck: true,
  },
]

export const SVM_UI_FEE_BIPS = 50
export const SVM_UI_FEE_PERCENT = SVM_UI_FEE_BIPS / 100
export const SVM_UI_FEE_DECIMAL = SVM_UI_FEE_BIPS / 10_000

export const EVM_UI_FEE_BIPS = 35
export const EVM_UI_FEE_PERCENT = EVM_UI_FEE_BIPS / 100
export const EVM_UI_FEE_DECIMAL = EVM_UI_FEE_BIPS / 10_000

export function getUiFeePercent(chainId: EvmChainId | SvmChainId) {
  if (isSvmChainId(chainId)) {
    return SVM_UI_FEE_PERCENT
  }
  return EVM_UI_FEE_PERCENT
}

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
] as const

export const BLADE_SUPPORTED_NETWORKS = BLADE_SUPPORTED_CHAIN_IDS.filter(
  (c) => !DISABLED_CHAIN_IDS.includes(c as (typeof DISABLED_CHAIN_IDS)[number]),
)

export const NEW_CHAIN_IDS = [
  SvmChainId.SOLANA,
  EvmChainId.MEGAETH,
  EvmChainId.XLAYER,
] as const

export const PREFERRED_CHAINID_ORDER = [
  ChainId.ETHEREUM,
  ...NEW_CHAIN_IDS,
  ChainId.SOLANA,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.OPTIMISM,
  ChainId.KATANA,
  ChainId.HEMI,
  ChainId.LINEA,
  ChainId.FILECOIN,
  ChainId.ROOTSTOCK,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.SKALE_EUROPA,
  ChainId.CELO,
  ChainId.HAQQ,
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
  SvmChainId.SOLANA,
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
): chainId is SupportedChainId => SUPPORTED_CHAIN_IDS.includes(chainId as any)

const UNSORTED_SUPPORTED_NETWORKS = [
  ...SUPPORTED_CHAIN_IDS,
  MvmChainId.APTOS,
  SvmChainId.SOLANA,
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
  ChainId.MODE,
  ChainId.MONAD,
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

  ChainId.SOLANA,
] as const

export type XSwapSupportedChainId = (typeof XSWAP_SUPPORTED_CHAIN_IDS)[number]

export const isXSwapSupportedChainId = (
  chainId: number,
): chainId is XSwapSupportedChainId =>
  XSWAP_SUPPORTED_CHAIN_IDS.includes(chainId as any)
