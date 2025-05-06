import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
} from '@sushiswap/ui'
import { type ChainId, ChainKey, type EvmChainId, isChainId } from 'sushi'
import { isAggregatorOnlyChainId } from 'sushi/config'

export const EXPLORE_NAVIGATION_LINKS = (
  chainId?: ChainId,
): NavigationElementDropdown['items'] => [
  {
    title: 'Swap',
    href: '/swap',
    description: 'The easiest way to trade.',
  },
  ...(!chainId || isPoolChainId(chainId)
    ? ([
        {
          title: 'Explore',
          href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/explore/pools`,
          description: 'Explore top pools.',
        },
      ] as const)
    : []),
  ...(!chainId || !isAggregatorOnlyChainId(chainId as EvmChainId)
    ? ([
        {
          title: 'Pool',
          href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/pool`,
          description: 'Earn fees by providing liquidity.',
        },
      ] as const)
    : []),
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
    href: `/${
      isChainId(Number(chainId)) ? ChainKey[chainId as ChainId] : 'ethereum'
    }/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: `/${
      isChainId(Number(chainId)) ? ChainKey[chainId as ChainId] : 'ethereum'
    }/pool`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
]
