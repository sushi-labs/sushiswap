'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import {
  LinkInternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { PathnameButton } from 'src/ui/pathname-button'

export function NavigationItems() {
  const searchParams = useSearchParams()
  const isSmallScreen = useIsSmScreen()

  const [tooltips, setTooltips] = useState<{ [key: string]: boolean }>({
    rewards: false,
    migrate: false,
  })

  const handleToggleTooltip = (id: string) => {
    setTooltips((prev) => {
      const newState: typeof prev = Object.fromEntries(
        Object.keys(prev).map((key) => [key, false]),
      )
      newState[id] = !prev[id]
      return newState
    })
  }

  return (
    <>
      <LinkInternal
        shallow
        scroll={false}
        href={`/kadena/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname="/kadena/pool"
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>

      <TooltipProvider delayDuration={0}>
        <div className="flex gap-2">
          {(['rewards', 'migrate'] as const).map((id) => (
            <Tooltip
              key={id}
              open={isSmallScreen ? tooltips[id] : undefined}
              onOpenChange={(open) => {
                if (isSmallScreen) {
                  setTooltips((prev) => ({ ...prev, [id]: open }))
                }
              }}
            >
              <TooltipTrigger asChild>
                <div
                  onClick={() => isSmallScreen && handleToggleTooltip(id)}
                  onKeyDown={() => isSmallScreen && handleToggleTooltip(id)}
                >
                  <PathnameButton
                    disabled
                    id={`btn-${id}`}
                    pathname=""
                    size="sm"
                  >
                    {id === 'rewards' ? 'My Rewards' : 'Migrate'}
                  </PathnameButton>
                </div>
              </TooltipTrigger>
              <TooltipContent className="dark:!text-yellow-200">
                <p>Not currently supported on Kadena network</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </>
  )
}
