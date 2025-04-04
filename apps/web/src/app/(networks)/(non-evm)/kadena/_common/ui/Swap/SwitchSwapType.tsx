'use client'

import { Button } from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import { PathnameButton } from 'src/ui/pathname-button'

const swapTypes = ['Swap', 'Limit', 'DCA']

const crossChainType = {
  label: 'Cross-Chain',
  icon: <ShuffleIcon width={20} height={20} className="text-blue" />,
  className: 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent',
}

export const SwitchSwapType = () => {
  return (
    <TooltipProvider>
      <div className="flex md:flex-row flex-col gap-2">
        <div className="flex gap-2">
          {swapTypes.map((type) => {
            const isDisabled = type !== 'Swap'
            const button = (
              <PathnameButton
                key={type}
                pathname={`/kadena/${type.toLowerCase()}`}
                size="sm"
                disabled={isDisabled}
              >
                {type}
              </PathnameButton>
            )

            return isDisabled ? (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <div>{button}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Not currently supported on Kadena network</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            )
          })}
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  key={crossChainType.label}
                  size="sm"
                  variant="secondary"
                  className={crossChainType.className}
                  disabled
                >
                  {crossChainType.icon}
                  {crossChainType.label}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
