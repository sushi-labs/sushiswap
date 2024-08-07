import {
  type NavigationElement,
  NavigationElementType,
  NavigationMenuLink,
  OnramperButton,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
import {
  EXPLORE_NAVIGATION_LINKS,
  MORE_NAVIGATION_LINKS,
} from 'src/app/_common/header-elements'
import { ChainId } from 'sushi'

export const headerElements = (chainId?: ChainId): NavigationElement[] => [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS(chainId),
    show: 'mobile',
    type: NavigationElementType.Dropdown,
  },
  {
    title: 'Swap',
    href: '/swap',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pools',
    href: `/${chainId ?? 1}/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    type: NavigationElementType.Custom,
    item: (
      <OnramperButton>
        <NavigationMenuLink className={navigationMenuTriggerStyle}>
          Buy Crypto
        </NavigationMenuLink>
      </OnramperButton>
    ),
    show: 'desktop',
  },
  {
    title: 'More',
    items: MORE_NAVIGATION_LINKS,
    show: 'desktop',
    type: NavigationElementType.Dropdown,
  },
]
