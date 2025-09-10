import { type NavigationElement, NavigationElementType } from '@sushiswap/ui'
import {
  mobileExploreNavigationElement,
  tradeNavigationElement,
} from 'src/app/_common/header-elements'
import { MvmChainId } from 'sushi/mvm'

export const headerElements: NavigationElement[] = [
  mobileExploreNavigationElement(MvmChainId.APTOS),
  tradeNavigationElement(MvmChainId.APTOS),
  {
    title: 'Explore',
    href: `/aptos/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },

  {
    title: 'Pool',
    href: `/aptos/pool`,
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
