'use client'

import { Message } from '@sushiswap/ui'
import { useParams, useSearchParams } from 'next/navigation'
import { getWidgetMode } from './get-widget-mode'
import { useIsCrossChainSwapMaintenance } from './lifi/use-is-maintenance'
import { useIsNearIntentsXSwapMaintenance } from './near-intents/hooks/use-is-near-intents-xswap-maintenance'

export function XSwapMaintenanceMessage() {
  const params = useParams<{ chainId: string }>()
  const searchParams = useSearchParams()
  const chainId0 = Number(params.chainId)
  const chainId1 = Number(searchParams.get('chainId1'))
  const mode = getWidgetMode(chainId0, chainId1)

  const { data: lifiMaintenance } = useIsCrossChainSwapMaintenance()
  const { data: nearMaintenance } = useIsNearIntentsXSwapMaintenance()

  const isMaintenance =
    mode === 'near-intents' ? nearMaintenance : lifiMaintenance

  if (!isMaintenance) return null

  return (
    <Message variant="warning" size="sm" className="text-center font-medium">
      Cross-chain swaps are currently undergoing maintenance. Please check back
      later.
    </Message>
  )
}
