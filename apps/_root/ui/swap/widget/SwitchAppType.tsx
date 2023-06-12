import React, { FC } from 'react'
import { Button } from '@sushiswap/ui/future/components/button'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'
import NonSSRWrapper from '../NonSSRWrapper'

export const SwitchAppType: FC = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outlined" color="default">
        Swap
      </Button>
      <NonSSRWrapper>
        <Tooltip description="Coming soon!">
          <Button className="pointer-events-none opacity-40" size="sm" variant="empty" color="default">
            Limit
          </Button>
        </Tooltip>
      </NonSSRWrapper>
    </div>
  )
}
