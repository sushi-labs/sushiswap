import { ChainId } from '../chain'

export const EXTRACTOR_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
  ChainId.BASE,
  // ChainId.BOBA,
  // ChainId.BOBA_AVAX,
  // ChainId.BOBA_BNB,
  ChainId.BSC,
  // ChainId.BTTC,
  ChainId.CELO,
  // ChainId.CORE,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  // ChainId.FUSE,
  ChainId.GNOSIS,
  // ChainId.HAQQ,
  // ChainId.HARMONY,
  // ChainId.HECO,
  // ChainId.KAVA,
  ChainId.LINEA,
  // ChainId.METIS,
  // ChainId.MOONBEAM,
  // ChainId.MOONRIVER,
  // ChainId.OKEX,
  ChainId.OPTIMISM,
  // ChainId.PALM,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.SCROLL,
  // ChainId.TELOS,
  // ChainId.THUNDERCORE,
  // ChainId.ZKSYNC_ERA,
] as const

export type ExtractorSupportedChainId =
  typeof EXTRACTOR_SUPPORTED_CHAIN_IDS[number]

export const isExtractorSupportedChainId = (
  chainId: number,
): chainId is ExtractorSupportedChainId =>
  EXTRACTOR_SUPPORTED_CHAIN_IDS.includes(chainId as ExtractorSupportedChainId)
