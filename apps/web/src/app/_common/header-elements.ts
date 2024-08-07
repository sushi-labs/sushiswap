import type { NavigationElementDropdown } from '@sushiswap/ui'

export const EXPLORE_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Swap',
    href: '/swap',
    description: 'The easiest way to trade.',
  },
  {
    title: 'Pools',
    href: '/explore/pools',
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
