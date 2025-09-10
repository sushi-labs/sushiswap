import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  LinkInternal,
  type NavigationElement,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from '@sushiswap/ui'
import {
  mobileExploreNavigationElement,
  tradeNavigationElement,
} from 'src/app/_common/header-elements'
import { type ChainId, getChainById } from 'sushi'
import { EvmChainId } from 'sushi/evm'

interface HeaderElements {
  chainId?: ChainId
  includeOnramper?: boolean
}

export const headerElements = ({
  chainId,
  includeOnramper = true,
}: HeaderElements): NavigationElement[] => [
  mobileExploreNavigationElement(chainId),
  tradeNavigationElement(chainId, includeOnramper),
  ...(!chainId || isPoolChainId(chainId)
    ? ([
        {
          title: 'Explore',
          href: `/${chainId ? getChainById(chainId).key : 'ethereum'}/explore/pools`,
          show: 'desktop',
          type: NavigationElementType.Single,
        },
      ] as const)
    : []),
  {
    show: 'desktop',
    type: NavigationElementType.Custom,
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>
          <LinkInternal
            href={`/${getChainById(chainId && isPoolChainId(chainId) ? chainId : EvmChainId.ETHEREUM).key}/pool`}
          >
            Positions
          </LinkInternal>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-[400px] gap-3 p-4">
            <NavigationListItem
              title={'Manage'}
              href={`/${getChainById(chainId && isPoolChainId(chainId) ? chainId : EvmChainId.ETHEREUM).key}/pool`}
            >
              Manage liquidity pool positions.
            </NavigationListItem>
            <NavigationListItem title={'Claim'} href={`/claim`}>
              Claim your fees and rewards.
            </NavigationListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
  },
  {
    title: 'Stake',
    href: '/stake',
    show: 'desktop',
    type: NavigationElementType.Single,
  },
]
