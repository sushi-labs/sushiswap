import { ChainId } from 'sushi/chain'

export const SUPPORTED_CHAINS = [
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
]

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]
export const isSupportedChainId = (chainId: number): chainId is SupportedChainId =>
  SUPPORTED_CHAINS.includes(chainId as SupportedChainId)
