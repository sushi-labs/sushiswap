import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  type NavigationElement,
  type NavigationElementDropdown,
  NavigationElementType,
  NavigationListItem,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuPrimitive,
  classNames,
  navigationElementShowMap,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'

export const EXPLORE_NAVIGATION_LINKS =
  (): NavigationElementDropdown['items'] => {
    return [
      {
        title: 'Swap',
        href: `/`,
        description: 'Swap any token on Sushi.',
      },
      {
        title: 'Trade',
        href: `/perps`,
        description: 'Trade perpetual contracts.',
      },
      {
        title: 'Portfolio',
        href: `/perps/portfolio`,
        description: 'View your perps portfolio.',
      },
      {
        title: 'Referrals',
        href: `/perps/referrals`,
        description: 'Track Sushi referral rewards.',
      },
      {
        title: 'Points',
        href: `/perps/points`,
        description: 'Track your points.',
      },
      {
        title: 'Vaults',
        href: `#`,
        description: 'Coming Soon',
      },
    ]
  }

export const headerElements = (): NavigationElement[] => {
  return [
    {
      show: 'mobile',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuPrimitive.Trigger asChild>
            <Button variant="ghost" className="ml-1">
              <SushiWithTextIcon width={80} />
              <DownTriangleIcon width={6} height={6} />
            </Button>
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuContent>
            <ul className="gap-3 p-4 w-[250px]">
              {EXPLORE_NAVIGATION_LINKS().map((component) => (
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
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem
          key={`trade:custom`}
          className={navigationElementShowMap['desktop']}
        >
          <NavigationMenuLink
            href={'/perps'}
            className={classNames(
              navigationMenuTriggerStyle,
              'focus:bg-transparent hover:!bg-secondary',
            )}
          >
            Trade
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem
          key={`portfolio:custom`}
          className={navigationElementShowMap['desktop']}
        >
          <NavigationMenuLink
            href={'/perps/portfolio'}
            className={classNames(
              navigationMenuTriggerStyle,
              'focus:bg-transparent hover:!bg-secondary',
            )}
          >
            Portfolio
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem
          key={`referrals:custom`}
          className={navigationElementShowMap['desktop']}
        >
          <NavigationMenuLink
            href={'/perps/referrals'}
            className={classNames(
              navigationMenuTriggerStyle,
              'focus:bg-transparent hover:!bg-secondary',
            )}
          >
            Referrals
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem
          key={`points:custom`}
          className={navigationElementShowMap['desktop']}
        >
          <NavigationMenuLink
            href={'/perps/points'}
            className={classNames(
              navigationMenuTriggerStyle,
              'focus:bg-transparent hover:!bg-secondary',
            )}
          >
            Points
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    },
    {
      show: 'desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger tabIndex={0} asChild>
              <div className="opacity-50 text-sm font-medium cursor-not-allowed py-2.5 px-4 rounded-xl focus:bg-accent hover:bg-secondary">
                Vaults
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              className="text-xs !p-2 !bg-black/10"
              side="bottom"
            >
              <div>Coming Soon</div>
            </HoverCardContent>
          </HoverCard>
        </NavigationMenuItem>
      ),
    },
  ]
}
