import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { isPoolChainId } from '@sushiswap/graph-client/data-api'
import {
  Button,
  LinkExternal,
  LinkInternal,
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuPrimitive,
  NavigationMenuTrigger,
  OnramperButton,
  Separator,
} from '@sushiswap/ui'
import { DiscordIcon } from '@sushiswap/ui/icons/DiscordIcon'
import { GithubIcon } from '@sushiswap/ui/icons/GithubIcon'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import Link from 'next/link'
import { type ChainId, getChainById, isChainId } from 'sushi'
import { EvmChainId, isAggregatorOnlyChainId } from 'sushi/evm'
import { CookieDialog } from './cookies/cookie-dialog'

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
          href: `/${chainId ? getChainById(chainId).key : 'ethereum'}/explore/pools`,
          description: 'Explore top pools.',
        },
      ] as const)
    : []),
  ...(!chainId || !isAggregatorOnlyChainId(chainId as EvmChainId)
    ? ([
        {
          title: 'Pool',
          href: `/${chainId ? getChainById(chainId).key : 'ethereum'}/pool`,
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
]

export const mobileExploreNavigationElement = (
  chainId?: ChainId,
): NavigationElement => {
  return {
    show: 'mobile',
    type: NavigationElementType.Custom,
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuPrimitive.Trigger asChild>
          <Button variant="secondary" icon={Bars3Icon} />
        </NavigationMenuPrimitive.Trigger>
        <NavigationMenuContent>
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
            <Separator />
            <div className={'px-3 py-6 w-full'}>
              <CookieDialog defaultOpen={false}>
                <span className="text-sm text-center cursor-pointer font-medium hover:text-muted-foreground focus:text-muted-foreground">
                  Manage Cookie Preferences
                </span>
              </CookieDialog>
            </div>
            <Separator />
            <div className="px-3 py-4 flex flex-col gap-4">
              <span className="text-sm font-medium cursor-default">
                Support
              </span>
              {SUPPORT_NAVIGATION_LINKS.map((component) => (
                <Link
                  key={component.title}
                  href={component.href}
                  target="_blank"
                  className={
                    'cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground'
                  }
                >
                  <span className="text-sm">{component.title}</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </Link>
              ))}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground cursor-default">
                  Socials
                </span>
                <div className="flex gap-5 items-center">
                  <LinkExternal href={'https://sushi.com/github'}>
                    <GithubIcon
                      width={18}
                      height={18}
                      className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                    />
                  </LinkExternal>
                  <LinkExternal href={'https://sushi.com/discord'}>
                    <DiscordIcon
                      width={18}
                      height={18}
                      className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                    />
                  </LinkExternal>
                  <LinkExternal href={'https://sushi.com/twitter'}>
                    <XIcon
                      width={18}
                      height={18}
                      className="text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground"
                    />
                  </LinkExternal>
                </div>
              </div>
            </div>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
  }
}

export const tradeNavigationElement = (
  chainId?: ChainId,
  includeOnramper = true,
): NavigationElement => {
  return {
    show: 'desktop',
    type: NavigationElementType.Custom,
    item: (
      <NavigationMenuItem className={NavigationElementType.Custom}>
        <NavigationMenuTrigger>
          <LinkInternal
            href={`/${getChainById(chainId ?? EvmChainId.ETHEREUM).key}/swap`}
          >
            Trade
          </LinkInternal>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-[400px] gap-3 p-4">
            <NavigationListItem
              title={'Swap'}
              href={`/${getChainById(chainId ?? EvmChainId.ETHEREUM).key}/swap`}
            >
              The easiest way to trade.
            </NavigationListItem>
            {includeOnramper ? (
              <OnramperButton>
                <NavigationListItem title={'Buy Crypto'}>
                  Onramp with fiat.
                </NavigationListItem>
              </OnramperButton>
            ) : null}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    ),
  }
}

export const headerElements = (
  chainId?: ChainId,
  includeOnramper?: boolean,
): NavigationElement[] => [
  mobileExploreNavigationElement(chainId),
  tradeNavigationElement(chainId, includeOnramper),
  {
    title: 'Explore',
    href: `/${
      chainId && isChainId(chainId)
        ? getChainById(chainId as ChainId).key
        : 'ethereum'
    }/explore/pools`,
    show: 'desktop',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: `/${
      chainId && isChainId(chainId) ? getChainById(chainId).key : 'ethereum'
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
