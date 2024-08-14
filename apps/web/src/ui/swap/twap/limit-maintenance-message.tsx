'use client'

import { Message } from '@sushiswap/ui'
import { useIsLimitMaintenance } from './use-is-limit-maintenance'

export const LimitMaintenanceMessage = () => {
  const { data: isMaintenance } = useIsLimitMaintenance()

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        Limit orders are currently undergoing maintenance. Please check back
        later.
      </Message>
    )

  return <></>
}
