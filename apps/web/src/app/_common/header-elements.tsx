import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
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
import { POOL_SUPPORTED_NETWORKS } from 'src/config'
import { ChainId, getChainById } from 'sushi'
import { CookieDialog } from './cookies/cookie-dialog'

export const EXPLORE_NAVIGATION_LINKS = (
  chainId?: ChainId,
): NavigationElementDropdown['items'] => {
  const isPoolChainId =
    chainId && POOL_SUPPORTED_NETWORKS.some((_chainId) => _chainId === chainId)

  return [
    {
      title: 'Swap',
      href: `/${getChainById(chainId ?? ChainId.ETHEREUM).key}/swap`,
      description: 'The easiest way to trade.',
    },
    {
      title: 'Explore',
      href: `/${getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key}/explore/pools`,
      description: 'Explore top pools.',
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
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuTrigger>
            <LinkInternal
              href={`/${getChainById(chainId ?? ChainId.ETHEREUM).key}/swap`}
            >
              Trade
            </LinkInternal>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[400px] gap-3 p-4">
              <NavigationListItem
                title={'Swap'}
                href={`/${getChainById(chainId ?? ChainId.ETHEREUM).key}/swap`}
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
    },
    {
      title: 'Explore',
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
          <NavigationMenuTrigger>
            <LinkInternal
              href={`/${getChainById(isPoolChainId ? chainId : ChainId.ETHEREUM).key}/pool`}
            >
              Positions
            </LinkInternal>
          </NavigationMenuTrigger>
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
      title: 'Stake',
      href: '/stake',
      show: 'desktop',
      type: NavigationElementType.Single,
    },
  ]
}
