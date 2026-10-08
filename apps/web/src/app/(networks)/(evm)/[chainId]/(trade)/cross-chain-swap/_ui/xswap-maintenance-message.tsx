'use client'

import { Message } from '@sushiswap/ui'
import { useIsLayerZeroXSwapMaintenance } from './layerzero/hooks/use-is-layerzero-xswap-maintenance'
import { useIsCrossChainSwapMaintenance } from './lifi/use-is-maintenance'
import { useIsNearIntentsXSwapMaintenance } from './near-intents/hooks/use-is-near-intents-xswap-maintenance'
import { useXSwapRouting } from './xswap-routing-context'

export function XSwapMaintenanceMessage() {
  const mode = useXSwapRouting()

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
