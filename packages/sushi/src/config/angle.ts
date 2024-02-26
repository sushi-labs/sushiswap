import { ChainId } from '../chain/index.js'

export const ANGLE_ENABLED_NETWORKS = [
  ChainId.ARBITRUM,
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  // ChainId.POLYGON_ZKEVM,
  ChainId.BASE,
  // ChainId.THUNDERCORE,
  // ChainId.CORE,
  // ChainId.GNOSIS
]
export type AngleEnabledChainId = (typeof ANGLE_ENABLED_NETWORKS)[number]
export const isAngleEnabledChainId = (
  chainId: number,
): chainId is AngleEnabledChainId =>
  ANGLE_ENABLED_NETWORKS.includes(chainId as AngleEnabledChainId)
