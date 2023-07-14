import { buttonVariants } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import React, { FC } from 'react'

export const SwitchAppType: FC = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary">
        Swap
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default">
            <div
              role="button"
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'pointer-events-none opacity-40' })}
            >
              Limit
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
