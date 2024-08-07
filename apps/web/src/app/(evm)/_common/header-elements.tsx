import {
  type NavigationElement,
  NavigationElementDropdown,
  NavigationElementType,
  NavigationMenuLink,
  OnramperButton,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
import { EXPLORE_NAVIGATION_LINKS } from 'src/app/_common/header-elements'

const MORE_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Pay',
    href: 'https://pay.sushi.com',
    description:
      'Stream or create a vesting schedule with any ERC20 to any wallet.',
  },
  {
    title: 'Bonds',
    href: 'https://sushi.com/bonds',
    description:
      'Buy discounted tokens with vesting to support projects in a sustainable manner.',
  },
]

export const headerElements: NavigationElement[] = [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS,
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
    href: '/explore/pool',
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
