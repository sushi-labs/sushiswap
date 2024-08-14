'use client'

import { Message } from '@sushiswap/ui'
import { useIsDCAMaintenance } from './use-is-dca-maintenance'

export const DCAMaintenanceMessage = () => {
  const { data: isMaintenance } = useIsDCAMaintenance()

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        DCA orders are currently undergoing maintenance. Please check back
        later.
      </Message>
    )

  return <></>
}
