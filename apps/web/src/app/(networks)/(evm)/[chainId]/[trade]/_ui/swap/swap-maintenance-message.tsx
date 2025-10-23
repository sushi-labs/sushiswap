'use client'

import { Message } from '@sushiswap/ui'
import { useIsSwapMaintenance } from './use-is-swap-maintenance'

export const SwapMaintenanceMessage = () => {
  const { data: isMaintenance } = useIsSwapMaintenance()

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        Swaps are currently undergoing maintenance. Please check back later.
      </Message>
    )

  return <></>
}
