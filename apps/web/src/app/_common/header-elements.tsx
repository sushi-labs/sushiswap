import { Bars3Icon } from '@heroicons/react/24/outline'
import {
  Button,
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuPrimitive,
  NavigationMenuTrigger,
} from '@sushiswap/ui'
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ChainId, getChainById } from 'sushi'
import { isLaunchpadV2ChainId } from 'sushi/evm'

export const EXPLORE_NAVIGATION_LINKS = (
  chainId?: ChainId,
): NavigationElementDropdown['items'] => {
  const isPoolChainId =
    chainId && POOL_SUPPORTED_NETWORKS.some((_chainId) => _chainId === chainId)
  const _isLaunchpadV2ChainId = chainId && isLaunchpadV2ChainId(chainId)

  return [
    {
      title: 'Swap',
      href: `/${getChainById(chainId ?? ChainId.ETHEREUM).key}/swap`,
      description: 'The easiest way to trade.',
    },
    {
      title: 'Pools',
      href: `/${getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key}/explore/pools`,
      description: 'Explore top pools.',
    },
    {
      title: 'Perps',
      href: `/perps`,
      description: 'Trade perpetual contracts.',
    },
    {
      title: 'Launchpad',
      href: `/${getChainById(_isLaunchpadV2ChainId ? chainId : ChainId.ROBINHOOD).key}/launchpad`,
      description: 'Discover and launch tokens with locked Sushi liquidity.',
    },
    {
      title: 'Pool',
      href: `/${getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key}/pool`,
      description: 'Earn fees by providing liquidity.',
    },

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
    {
      title: 'Strategic Reserve',
      href: '/strategic-reserve',
      description: 'View SUSHI Buyback & Strategic Reserve.',
    },
  ]
}

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

export const SUPPORT_NAVIGATION_LINKS: NavigationElementDropdown['items'] = [
  {
    title: 'Sushi Academy',
    href: '/academy',
    description: 'Everything you need to get up to speed with DeFi.',
  },
  {
    title: 'FAQ',
    href: '/faq',
    description: 'Answers to the most common questions about Sushi.',
  },
  {
    title: 'Privacy Policy',
    href: '/legal/privacy-policy',
    description: 'Our commitment to safeguarding your data.',
  },
  {
    title: 'Terms of Service',
    href: '/legal/terms-of-service',
    description: 'Our terms and conditions for using Sushi.',
  },
  {
    title: 'Launchpad Terms of Service',
    href: '/legal/sushi-launchpad-terms-of-use',
    description: 'Our terms and conditions for using Sushi Launchpad.',
  },
]

interface HeaderElements {
  chainId?: ChainId
  includeOnramper?: boolean
}

export const headerElements = ({
  chainId,
  includeOnramper = true,
}: HeaderElements = {}): NavigationElement[] => {
  const isPoolChainId =
    chainId && POOL_SUPPORTED_NETWORKS.some((_chainId) => _chainId === chainId)
  const _isLaunchpadV2ChainId = chainId && isLaunchpadV2ChainId(chainId)
  console.log(`todo: find new place for onramper ${includeOnramper}`)
  return [
    {
      show: 'mobile',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuPrimitive.Trigger asChild>
            <Button variant="secondary" className="ml-1">
              <Bars3Icon className="h-5 w-5" />
            </Button>
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuContent className="hide-scrollbar">
            <ul className="gap-3 p-4 w-[250px]">
              {EXPLORE_NAVIGATION_LINKS(chainId).map((component) => (
                <NavigationListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </NavigationListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ),
    },
    {
      title: 'Trade',
      href: `/${getChainById(chainId ?? ChainId.ETHEREUM).key}/swap`,
      show: 'desktop',
      type: NavigationElementType.Single,
    },
    {
      title: 'Perps',
      href: `/perps`,
      show: 'desktop',
      type: NavigationElementType.Single,
    },
    {
      title: 'Launchpad',
      href: `/${getChainById(_isLaunchpadV2ChainId ? chainId : ChainId.ROBINHOOD).key}/launchpad`,
      show: 'desktop',
      type: NavigationElementType.Single,
    },
    {
      title: 'Pools',
      href: `/${
        getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key
      }/explore/pools`,
      show: 'desktop',
      type: NavigationElementType.Single,
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuTrigger>Positions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[400px] gap-3 p-4">
              <NavigationListItem
                title={'Manage'}
                href={`/${getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key}/pool`}
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
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuTrigger>Stake</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[400px] gap-3 p-4">
              <NavigationListItem title={'Stake'} href={`/stake`}>
                Stake your SUSHI tokens to earn rewards.
              </NavigationListItem>
              <NavigationListItem
                title={'Strategic Reserve'}
                href={`/strategic-reserve`}
              >
                View SUSHI Buyback & Strategic Reserve.
              </NavigationListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ),
    },
  ]
}
