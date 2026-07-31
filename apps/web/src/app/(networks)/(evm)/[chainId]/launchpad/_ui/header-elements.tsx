import {
  Button,
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

function getLaunchpadNavigationLinks(
  chainKey: string,
): NavigationElementDropdown['items'] {
  const root = `/${chainKey}/launchpad`

  return [
    {
      title: 'Swap',
      href: `/${chainKey}/swap`,
      description: 'Return to SushiSwap.',
    },
    {
      title: 'Discover',
      href: root,
      description: 'Explore confirmed token launches.',
    },
    {
      title: 'Create',
      href: `${root}/create`,
      description: 'Launch a token with locked Sushi liquidity.',
    },
    {
      title: 'My Launches',
      href: `${root}/manage`,
      description: 'Manage metadata and distribute fees.',
    },
    {
      title: 'Portfolio',
      href: `${root}/portfolio`,
      description: 'Track your launchpad holdings and performance.',
    },
  ]
}

function launchpadHeaderElements(chainKey: string): NavigationElement[] {
  const root = `/${chainKey}/launchpad`
  const desktopItems = [
    { title: 'Discover', href: root },
    { title: 'Create', href: `${root}/create` },
    { title: 'My Launches', href: `${root}/manage` },
    { title: 'Portfolio', href: `${root}/portfolio` },
  ]

  return [
    {
      show: 'perps-mobile',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem className={NavigationElementType.Custom}>
          <NavigationMenuPrimitive.Trigger asChild>
            <Button variant="ghost" className="ml-1">
              <SushiWithTextIcon width={80} />
              <DownTriangleIcon width={6} height={6} />
            </Button>
          </NavigationMenuPrimitive.Trigger>
          <NavigationMenuContent className="!bg-perps-background">
            <ul className="w-[260px] gap-3 p-4">
              {getLaunchpadNavigationLinks(chainKey).map((item) => (
                <NavigationListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </NavigationListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ),
    },
    ...desktopItems.map<NavigationElement>((item) => ({
      show: 'perps-desktop',
      type: NavigationElementType.Custom,
      item: (
        <NavigationMenuItem
          key={item.title}
          className={navigationElementShowMap['perps-desktop']}
        >
          <NavigationMenuLink
            href={item.href}
            className={classNames(
              navigationMenuTriggerStyle,
              'focus:bg-transparent hover:!bg-secondary',
            )}
          >
            {item.title}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    })),
  ]
}

export { launchpadHeaderElements }
