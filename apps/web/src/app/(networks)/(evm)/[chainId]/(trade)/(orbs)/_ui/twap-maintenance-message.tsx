'use client'

import { Message } from '@sushiswap/ui'
import { useIsTwapMaintenance } from './use-is-twap-maintenance'
import { Module } from '@orbs-network/spot-react'
import { useMemo } from 'react'

export const TwapMaintenanceMessage = ({ module }: { module: Module }) => {
  const { data: isMaintenance } = useIsTwapMaintenance(module)

  const title = useMemo(() => {
    switch (module) {
      case Module.LIMIT:
        return 'Limit orders'
      case Module.STOP_LOSS:
        return 'Stop-loss orders'
      case Module.TWAP:
        return 'DCA orders'
      case Module.TAKE_PROFIT:
        return 'Take-profit orders'
      default:
        return 'Orders'
    }
  }, [module])

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        {title} are currently undergoing maintenance. Please check back later.
      </Message>
    )

  return <></>
}
