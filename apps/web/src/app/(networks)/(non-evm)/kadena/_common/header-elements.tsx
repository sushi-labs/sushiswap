import {
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  OnramperButton,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
import Link from 'next/link'
import React from 'react'

const EXPLORE_NAVIGATION_LINKS = (): NavigationElementDropdown['items'] => [
  {
    title: 'Swap',
    href: '/kadena/swap',
    description: 'The easiest way to trade.',
  },

  {
    title: 'Explore',
    href: `/kadena/explore/pools`,
    description: 'Explore top pools.',
  },

  {
    title: 'Pool',
    href: `/kadena/pool`,
    description: 'Earn fees by providing liquidity.',
  },

  {
    title: 'Claim',
    href: '/claim',
    description: 'Claim your fees and rewards.',
  },
  {
    title: 'Stake',
    href: '/stake',
    description: 'Earn protocol fees by staking SUSHI.',
  },
]

export const headerElements: NavigationElement[] = [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS(),
    show: 'mobile',
    type: NavigationElementType.Dropdown,
  },
  {
    show: 'desktop',
    type: NavigationElementType.Custom,
    href: '/swap',
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>Trade</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-[400px] gap-3 p-4">
            <NavigationListItem title={'Swap'} href={'/kadena/swap'}>
              The easiest way to trade.
            </NavigationListItem>
            <OnramperButton>
              <NavigationListItem title={'Buy Crypto'}>
                Onramp with fiat.
              </NavigationListItem>
            </OnramperButton>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
  },
  {
    show: 'desktop',
    type: NavigationElementType.Custom,
    item: (
      <NavigationMenuItem>
        <Link
          href={`/kadena/explore/pools`}
          className={navigationMenuTriggerStyle}
        >
          Explore
        </Link>
      </NavigationMenuItem>
    ),
  },
  {
    show: 'desktop',
    type: NavigationElementType.Custom,
    item: (
      <NavigationMenuItem>
        <Link href={`/kadena/pool`} className={navigationMenuTriggerStyle}>
          Pool
        </Link>
      </NavigationMenuItem>
    ),
  },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
]
