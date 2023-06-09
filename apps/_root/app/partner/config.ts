import { ChainId } from '@sushiswap/chain'

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.MOONRIVER,
  ChainId.FANTOM,
  ChainId.BSC,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.TELOS,
  ChainId.CELO,
  ChainId.FUSE,
  ChainId.OKEX,
  ChainId.HECO,
  ChainId.PALM,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BOBA,
  ChainId.BOBA_AVAX,
  ChainId.ARBITRUM_NOVA,
  ChainId.THUNDERCORE,
  ChainId.OPTIMISM,
  ChainId.MOONBEAM,
  ChainId.BOBA_BNB,
  ChainId.BTTC,
  ChainId.POLYGON_ZKEVM,
] as const

export type SupportedChainIds = typeof SUPPORTED_CHAINS
export type SupportedChainId = SupportedChainIds[number]
