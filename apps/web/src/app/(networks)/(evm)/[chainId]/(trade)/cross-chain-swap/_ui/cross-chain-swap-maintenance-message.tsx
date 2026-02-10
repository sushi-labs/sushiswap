'use client'

import { Message } from '@sushiswap/ui'
import { useIsCrossChainSwapMaintenance } from './use-is-cross-chain-swap-maintenance'

export function CrossChainSwapMaintenanceMessage() {
  const { data: isMaintenance } = useIsCrossChainSwapMaintenance()

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        Cross-chain swaps are currently undergoing maintenance. Please check
        back later.
      </Message>
    )

  return <></>
}
