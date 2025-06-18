'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import {
  type NavigationElement,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  OnramperButton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'
import { EXPLORE_NAVIGATION_LINKS } from 'src/app/_common/header-elements'

export const HeaderElements = () => {
  const isSmallScreen = useIsSmScreen()
  const [tooltips, setTooltips] = useState<{ [key: string]: boolean }>({
    stake: false,
  })

  const handleToggleTooltip = (id: string) => {
    setTooltips((prev) => {
      const nextState: typeof prev = Object.fromEntries(
        Object.keys(prev).map((key) => [key, false]),
      )
      nextState[id] = !prev[id]
      return nextState
    })
  }

  const headerElements: NavigationElement[] = [
    {
      title: 'Explore',
      items: EXPLORE_NAVIGATION_LINKS(),
      show: 'mobile',
      type: NavigationElementType.Dropdown,
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuTrigger>Trade</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[400px] gap-3 p-4">
              <NavigationListItem title="Swap" href="/kadena/swap">
                The easiest way to trade.
              </NavigationListItem>
              <OnramperButton>
                <NavigationListItem title="Buy Crypto">
                  Onramp with fiat.
                </NavigationListItem>
              </OnramperButton>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ),
    },
    {
      href: '/kadena/explore/pools',
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <Link
          href="/kadena/explore/pools"
          className="px-4 py-2 text-sm font-medium"
        >
          Explore
        </Link>
      ),
    },
    {
      href: '/kadena/pool',
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <Link href="/kadena/pool" className="px-4 py-2 text-sm font-medium">
          Pool
        </Link>
      ),
    },

    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <TooltipProvider delayDuration={0}>
          <Tooltip
            open={isSmallScreen ? tooltips.stake : undefined}
            onOpenChange={(open) =>
              isSmallScreen
                ? setTooltips((prev) => ({ ...prev, stake: open }))
                : undefined
            }
          >
            <TooltipTrigger asChild>
              <button
                className="px-4 py-2 text-sm font-medium opacity-50"
                disabled
                type="button"
                onClick={() => isSmallScreen && handleToggleTooltip('stake')}
                onKeyDown={() => isSmallScreen && handleToggleTooltip('stake')}
              >
                Stake
              </button>
            </TooltipTrigger>
            <TooltipContent className="dark:!text-yellow-200">
              <p>Not currently supported on Kadena network</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ]

  return headerElements
}
