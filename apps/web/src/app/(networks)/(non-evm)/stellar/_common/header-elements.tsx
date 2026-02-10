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

export const headerElements: NavigationElement[] = [
  {
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>
          <LinkInternal href={'/stellar/swap'}>Explore</LinkInternal>
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
            <NavigationListItem
              title={'Explore'}
              href={'/stellar/explore/pools'}
            >
              Explore top pools.
            </NavigationListItem>
            <NavigationListItem title={'Positions'} href={'/stellar/pool'}>
              Earn fees by providing liquidity.
            </NavigationListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
    show: 'mobile',
    type: NavigationElementType.Custom,
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
    title: 'Positions',
    href: `/stellar/pool`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
]
