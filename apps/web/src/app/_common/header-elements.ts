import {
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
} from '@sushiswap/ui'
import { ChainId } from 'sushi'

export const EXPLORE_NAVIGATION_LINKS = (
  chainId?: ChainId,
): NavigationElementDropdown['items'] => [
  {
    title: 'Swap',
    href: '/swap',
    description: 'The easiest way to trade.',
  },
  {
    title: 'Pools',
    href: `/${chainId ?? 1}/explore/pools`,
    description: 'Earn fees by providing liquidity.',
  },
  {
    title: 'Bonds',
    href: '/bonds',
    description: 'Earn interest by locking up your assets.',
  },
  {
    title: 'Stake',
    href: '/stake',
    description: 'Earn protocol fees by staking SUSHI.',
  },
  {
    title: 'Blog',
    href: '/blog',
    description:
      'Stay up to date with the latest product developments at Sushi.',
  },
  {
    title: 'Academy',
    href: '/academy',
    description: 'Everything you need to get up to speed with DeFi.',
  },
  {
    title: 'Partner with Sushi',
    href: '/partner',
    description: 'Incentivize your token with Sushi rewards.',
  },
  {
    title: 'List enquiry',
    href: '/tokenlist-request',
    description: 'Get your token on our default token list.',
  },
]

export const MORE_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Pay',
    href: 'https://pay.sushi.com',
    description:
      'Stream or create a vesting schedule with any ERC20 to any wallet.',
  },
  {
    title: 'Bonds',
    href: '/bonds',
    description:
      'Buy discounted tokens with vesting to support projects in a sustainable manner.',
  },
]

export const headerElements = (chainId?: ChainId): NavigationElement[] => [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS(chainId),
    show: 'mobile',
    type: NavigationElementType.Dropdown,
  },
  {
    title: 'Trade',
    href: '/swap',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Explore',
    href: `/${chainId ?? 1}/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Positions',
    href: `/${chainId ?? 1}/positions`,
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
    title: 'More',
    items: MORE_NAVIGATION_LINKS,
    show: 'desktop',
    type: NavigationElementType.Dropdown,
  },
]
