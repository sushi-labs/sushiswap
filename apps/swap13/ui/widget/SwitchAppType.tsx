'use client'

import { AppType } from '@sushiswap/ui13/types'
import React, { FC } from 'react'

import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { Tab } from '@sushiswap/ui13/components/tabs'
import { Button } from '@sushiswap/ui13/components/button'
import { Tooltip } from '@sushiswap/ui13/components/Tooltip'

export const SwitchAppType: FC = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outlined" color="default">
        Swap
      </Button>
      <Tooltip description="Coming Soon™">
        <Button className="pointer-events-none" size="sm" variant="empty" color="default">
          Limit
        </Button>
      </Tooltip>
    </div>
  )
}
