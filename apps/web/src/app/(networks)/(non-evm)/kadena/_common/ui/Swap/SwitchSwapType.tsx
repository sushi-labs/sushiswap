'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import { useState } from 'react'
import { PathnameButton } from 'src/ui/pathname-button'

const swapTypes = ['Swap', 'Limit', 'DCA']

const crossChainType = {
  label: 'Cross-Chain',
  icon: <ShuffleIcon width={20} height={20} className="text-blue" />,
  className: 'bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent',
}

export const SwitchSwapType = () => {
  const [openTypeTooltip, setOpenTypeTooltip] = useState<string | null>(null)
  const [openCrossChainTooltip, setOpenCrossChainTooltip] = useState(false)

  const isSmallScreen = useIsSmScreen()

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex gap-2">
          {swapTypes.map((type) => {
            const isDisabled = type !== 'Swap'
            const isOpen = openTypeTooltip === type

            const button = (
              <PathnameButton
                key={type}
                pathname={`/kadena/${type.toLowerCase()}`}
                size="sm"
                disabled={isDisabled}
                onClick={() => {
                  if (isSmallScreen && isDisabled) {
                    setOpenTypeTooltip((prev) => (prev === type ? null : type))
                  }
                }}
              >
                {type}
              </PathnameButton>
            )

            return isDisabled ? (
              <Tooltip
                key={type}
                open={isSmallScreen ? isOpen : undefined}
                onOpenChange={(open) =>
                  isSmallScreen
                    ? setOpenTypeTooltip(open ? type : null)
                    : undefined
                }
                delayDuration={0}
              >
                <TooltipTrigger asChild>
                  <div>{button}</div>
                </TooltipTrigger>
                <TooltipContent className="dark:!text-yellow-200">
                  <p>Not currently supported on Kadena network</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              button
            )
          })}
        </div>
        <div className="flex gap-2">
          <Tooltip
            delayDuration={0}
            open={isSmallScreen ? openCrossChainTooltip : undefined}
            onOpenChange={(open) =>
              isSmallScreen ? setOpenCrossChainTooltip(open) : undefined
            }
          >
            <TooltipTrigger asChild>
              <div
                onClick={() =>
                  isSmallScreen
                    ? setOpenCrossChainTooltip((prev) => !prev)
                    : undefined
                }
                onKeyDown={() =>
                  isSmallScreen
                    ? setOpenCrossChainTooltip((prev) => !prev)
                    : undefined
                }
              >
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
