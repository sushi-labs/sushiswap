import { ChainId } from '../chain/index.js'

export const ANGLE_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.POLYGON_ZKEVM,
  ChainId.BASE,
  // ChainId.THUNDERCORE,
  // ChainId.CORE,
  ChainId.GNOSIS,
  ChainId.BLAST,
  ChainId.SCROLL,
  ChainId.LINEA,
  ChainId.BSC,
]
export type AngleEnabledChainId = (typeof ANGLE_SUPPORTED_CHAIN_IDS)[number]
export const isAngleEnabledChainId = (
  chainId: number,
): chainId is AngleEnabledChainId =>
  ANGLE_SUPPORTED_CHAIN_IDS.includes(chainId as AngleEnabledChainId)
