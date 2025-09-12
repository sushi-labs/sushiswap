'use client'

import { Message } from '@sushiswap/ui'
import { useDerivedStateTwap } from './derivedstate-twap-provider'
import { useIsTwapMaintenance } from './use-is-twap-maintenance'

export const TwapMaintenanceMessage = () => {
  const { data: isMaintenance } = useIsTwapMaintenance()
  const {
    state: { isLimitOrder },
  } = useDerivedStateTwap()

  if (isMaintenance)
    return (
      <Message variant="warning" size="sm" className="text-center font-medium">
        {isLimitOrder ? 'Limit' : 'DCA'} orders are currently undergoing
        maintenance. Please check back later.
      </Message>
    )

  return <></>
}
