import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import { type NavigationElement, NavigationElementType } from '@sushiswap/ui'
import { EXPLORE_NAVIGATION_LINKS } from 'src/app/_common/header-elements'
import { isEvmChainId } from 'sushi'
import { type ChainId, ChainKey } from 'sushi/chain'

interface HeaderElements {
  chainId?: ChainId
  includeOnramper?: boolean
}

export const headerElements = ({
  chainId,
  includeOnramper = true,
}: HeaderElements): NavigationElement[] => [
  {
    title: 'Explore',
    items: EXPLORE_NAVIGATION_LINKS(chainId),
    show: 'mobile',
    type: NavigationElementType.Dropdown,
  },
  {
    title: 'Trade',
    href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/swap`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  ...(!chainId || isPoolChainId(chainId)
    ? ([
        {
          title: 'Explore',
          href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/explore/pools`,
          show: 'desktop',
          type: NavigationElementType.Single,
        },
      ] as const)
    : []),
  ...(!chainId || isEvmChainId(chainId)
    ? ([
        {
          title: 'Portfolio',
          href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/portfolio`,
          show: 'desktop',
          type: NavigationElementType.Single,
        },
      ] as const)
    : []),
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  ...(includeOnramper
    ? ([
        {
          title: 'Buy Crypto',
          href: `/${chainId ? ChainKey[chainId] : 'ethereum'}/fiat/advanced`,
          show: 'desktop',
          type: NavigationElementType.Single,
        },
      ] as const)
    : []),
]
