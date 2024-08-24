import { ChainId } from '../../chain/index.js'

export const FURO_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.HAQQ,
  ChainId.CORE,
  ChainId.THUNDERCORE,
  ChainId.BTTC,
] as const

export type FuroChainId = (typeof FURO_SUPPORTED_CHAIN_IDS)[number]

export const isFuroChainId = (chainId: ChainId): chainId is FuroChainId =>
  FURO_SUPPORTED_CHAIN_IDS.includes(chainId as FuroChainId)
