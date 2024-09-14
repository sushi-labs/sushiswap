import { ChainId } from '../../chain/index.js'

export const EXTRACTOR_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.ARBITRUM_NOVA,
  ChainId.AVALANCHE,
  ChainId.BASE,
  ChainId.BOBA,
  ChainId.BOBA_BNB,
  ChainId.BSC,
  ChainId.BTTC,
  ChainId.CELO,
  ChainId.CORE,
  ChainId.ETHEREUM,
  ChainId.FANTOM,
  ChainId.FILECOIN,
  ChainId.FUSE,
  ChainId.GNOSIS,
  ChainId.HAQQ,
  ChainId.HARMONY,
  ChainId.KAVA,
  ChainId.LINEA,
  ChainId.METIS,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.SCROLL,
  ChainId.TELOS,
  ChainId.THUNDERCORE,
  ChainId.ZETACHAIN,
  ChainId.CRONOS,
  ChainId.BLAST,
  ChainId.SKALE_EUROPA,
  ChainId.ROOTSTOCK,
  ChainId.MANTLE,
  ChainId.ZKSYNC_ERA,
  ChainId.CURTIS,
] as const

export type ExtractorSupportedChainId =
  (typeof EXTRACTOR_SUPPORTED_CHAIN_IDS)[number]

export const isExtractorSupportedChainId = (
  chainId: number,
): chainId is ExtractorSupportedChainId =>
  EXTRACTOR_SUPPORTED_CHAIN_IDS.includes(chainId as ExtractorSupportedChainId)
