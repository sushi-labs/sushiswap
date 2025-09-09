import {
  type NavigationElement,
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
import { EXPLORE_NAVIGATION_LINKS } from 'src/app/_common/header-elements'

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
