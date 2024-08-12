import {
  type NavigationElement,
  NavigationElementDropdown,
  NavigationElementType,
} from '@sushiswap/ui'
import { EXPLORE_NAVIGATION_LINKS } from 'src/app/_common/header-elements'

const TOOLS_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Analytics',
    href: '/analytics',
    description: 'Find the best opportunities',
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
    title: 'Forum & Proposals',
    href: 'https://forum.sushi.com',
    description: 'View and discuss proposals for SushiSwap.',
  },
  {
    title: 'Participate',
    href: 'https://snapshot.org/#/sushigov.eth',
    description:
      'As a Sushi holder, you can vote on proposals to shape the future of SushiSwap.',
  },
]

const PARTNER_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
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
    href: '/pool',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  // {
  //   title: 'Bonds',
  //   href: '/bonds',
  //   show: 'desktop',
  //   type: NavigationElementType.Single,
  // },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'More',
    items: TOOLS_NAVIGATION_LINKS,
    show: 'desktop',
    type: NavigationElementType.Dropdown,
  },
  {
    title: 'Partners',
    items: PARTNER_NAVIGATION_LINKS,
    show: 'desktop',
    type: NavigationElementType.Dropdown,
  },
]
