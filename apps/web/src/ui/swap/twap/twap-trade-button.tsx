'use client'

import { DialogTrigger } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import React from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useTwapTrade } from './derivedstate-twap-provider'
import { TwapTradeReviewDialog } from './twap-trade-review-dialog'
import { useIsTwapMaintenance } from './use-is-twap-maintenance'

export const TwapTradeButton = () => {
  const { data: maintenance } = useIsTwapMaintenance()

  const trade = useTwapTrade()

  return (
    <TwapTradeReviewDialog>
      <Checker.Guard
        guardWhen={maintenance}
        guardText="Maintenance in progress"
      >
        <DialogTrigger asChild>
          <Button size="xl" disabled={!trade} fullWidth testId="swap">
            Place order
          </Button>
        </DialogTrigger>
      </Checker.Guard>
    </TwapTradeReviewDialog>
  )
}
