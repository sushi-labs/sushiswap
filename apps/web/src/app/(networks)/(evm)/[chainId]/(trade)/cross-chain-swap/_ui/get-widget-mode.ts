import { isLifiXSwapSupportedChainId } from 'src/config'
import {
  isLayerZeroTokenParam,
  isLayerZeroUsdt0Route,
} from 'src/lib/swap/layerzero/config'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { StellarChainId } from 'sushi/stellar'

export type WidgetMode = 'near-intents' | 'layerzero' | 'lifi' | 'unsupported'

export function getWidgetMode(
  chainId0: number,
  chainId1: number,
  token0Param?: string,
  token1Param?: string,
): WidgetMode {
  const hasDestination = Number.isFinite(chainId1) && chainId1 !== 0
  const stellarSource = chainId0 === StellarChainId.STELLAR
  const stellarDestination = chainId1 === StellarChainId.STELLAR

  if (stellarSource || stellarDestination) {
    if (isLayerZeroUsdt0Route(chainId0, chainId1, token0Param, token1Param))
      return 'layerzero'
    if (
      !hasDestination &&
      stellarSource &&
      isLayerZeroTokenParam(StellarChainId.STELLAR, token0Param)
    )
      return 'layerzero'
    if (!hasDestination) return 'near-intents'
    return isNearIntentsChainId(chainId0) && isNearIntentsChainId(chainId1)
      ? 'near-intents'
      : 'unsupported'
  }

  if (!isLifiXSwapSupportedChainId(chainId0)) return 'unsupported'
  if (hasDestination && !isLifiXSwapSupportedChainId(chainId1)) {
    return 'unsupported'
  }
  return 'lifi'
}
