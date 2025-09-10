import { type NavigationElement, NavigationElementType } from '@sushiswap/ui'
import {
  mobileExploreNavigationElement,
  tradeNavigationElement,
} from 'src/app/_common/header-elements'
import { TvmChainId } from 'sushi/tvm'

export const headerElements: NavigationElement[] = [
  mobileExploreNavigationElement(TvmChainId.TRON),
  tradeNavigationElement(TvmChainId.TRON),
  {
    title: 'Explore',
    href: `/tron/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },

  {
    title: 'Pool',
    href: `/tron/pool`,
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
