import React, { FC } from 'react'
import { Button } from '@sushiswap/ui/future/components/button'
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@sushiswap/ui/future/components/tooltip'

export const SwitchAppType: FC = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outlined" color="default">
        Swap
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default">
            <Button className="pointer-events-none opacity-40" size="sm" variant="empty" color="default">
              Limit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
