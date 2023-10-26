'use client'

import {
  LinkInternal,
  NavigationContainer,
  NavigationListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'

export default function InternalLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationContainer>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <LinkInternal href="/internal">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </LinkInternal>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>BentoBox</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[400px] gap-3 p-4">
                  <NavigationListItem
                    title="Overview"
                    href="/internal/bentobox"
                  >
                    Overview
                  </NavigationListItem>
                  <NavigationListItem
                    title="Strategies"
                    href="internal/strategies"
                  >
                    Strategies
                  </NavigationListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <LinkInternal href="/internal/tokens">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tokens
                </NavigationMenuLink>
              </LinkInternal>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <LinkInternal href="/internal/subgraphs">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Subgraphs
                </NavigationMenuLink>
              </LinkInternal>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationContainer>
      {children}
    </>
  )
}
