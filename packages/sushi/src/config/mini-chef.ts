import { ChainId } from '../chain/index.js'

export const MINICHEF_SUPPORTED_CHAIN_IDS = [
  ChainId.POLYGON,
  ChainId.GNOSIS,
  // ChainId.HARMONY,
  ChainId.ARBITRUM,
  ChainId.CELO,
  ChainId.MOONRIVER,
  ChainId.FUSE,
  ChainId.FANTOM,
  ChainId.MOONBEAM,
  ChainId.KAVA,
  ChainId.METIS,
  ChainId.BOBA,
  ChainId.ARBITRUM_NOVA,
  ChainId.BTTC,
  ChainId.OPTIMISM,
  ChainId.AVALANCHE,
  ChainId.BSC,
] as const

export type MiniChefChainId = (typeof MINICHEF_SUPPORTED_CHAIN_IDS)[number]

export const isMiniChefChainId = (
  chainId: ChainId,
): chainId is MiniChefChainId =>
  MINICHEF_SUPPORTED_CHAIN_IDS.includes(chainId as MiniChefChainId)
