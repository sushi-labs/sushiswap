'use client'

import { Message } from '@sushiswap/ui'
import { getWidgetMode } from './get-widget-mode'
import { useIsLayerZeroXSwapMaintenance } from './layerzero/hooks/use-is-layerzero-xswap-maintenance'
import { useIsCrossChainSwapMaintenance } from './lifi/use-is-maintenance'
import { useIsNearIntentsXSwapMaintenance } from './near-intents/hooks/use-is-near-intents-xswap-maintenance'
import { useXSwapForm } from './xswap-form-provider'

export function XSwapMaintenanceMessage() {
  const { chainId0, chainId1, token0Param, token1Param } = useXSwapForm()
  const mode = getWidgetMode(
    chainId0,
    chainId1 ?? Number.NaN,
    token0Param,
    token1Param,
  )

  const { data: lifiMaintenance } = useIsCrossChainSwapMaintenance()
  const { data: nearMaintenance } = useIsNearIntentsXSwapMaintenance()
  const { data: layerZeroMaintenance } = useIsLayerZeroXSwapMaintenance()

  const isMaintenance =
    mode === 'layerzero'
      ? layerZeroMaintenance
      : mode === 'near-intents'
        ? nearMaintenance
        : lifiMaintenance

  if (!isMaintenance) return null

  return (
    <Message variant="warning" size="sm" className="text-center font-medium">
      Cross-chain swaps are currently undergoing maintenance. Please check back
      later.
    </Message>
  )
}
