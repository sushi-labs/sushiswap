import { FC } from 'react'
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@sushiswap/ui/future/components/tooltip'

export const FarmRewardsAvailableTooltip: FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>✨</TooltipTrigger>
        <TooltipContent>
          <p>Farm rewards available</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
