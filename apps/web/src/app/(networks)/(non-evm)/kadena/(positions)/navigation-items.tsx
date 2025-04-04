'use client'

import {
  LinkInternal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { PathnameButton } from 'src/ui/pathname-button'

export function NavigationItems() {
  const searchParams = useSearchParams()

  return (
    <>
      <LinkInternal
        shallow={true}
        scroll={false}
        href={`/kadena/pool?${searchParams.toString()}`}
      >
        <PathnameButton
          id="my-positions"
          pathname={'/kadena/pool'}
          asChild
          size="sm"
        >
          My Positions
        </PathnameButton>
      </LinkInternal>

      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <PathnameButton
                  disabled
                  id="my-rewards"
                  pathname={''}
                  size="sm"
                >
                  My Rewards
                </PathnameButton>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Not currently supported on Kadena network</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <PathnameButton disabled id="migrate" pathname={''} size="sm">
                  Migrate
                </PathnameButton>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Not currently supported on Kadena network</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  )
}
