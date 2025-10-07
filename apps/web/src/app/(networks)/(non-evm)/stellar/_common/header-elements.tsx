import {
  LinkInternal,
  type NavigationElement,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  OnramperButton,
} from '@sushiswap/ui'
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
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>
          <LinkInternal href={'/stellar/swap'}>Trade</LinkInternal>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-[400px] gap-3 p-4">
            <NavigationListItem title={'Swap'} href={'/stellar/swap'}>
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
    title: 'Explore',
    href: `/stellar/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: `/stellar/pool`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
]
