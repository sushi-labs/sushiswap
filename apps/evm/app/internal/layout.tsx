'use client'

import {
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
import Link from 'next/link'

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
              <Link href="/internal">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Bentobox</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[400px] gap-3 p-4">
                  <NavigationListItem title="Overview" href="/internal/bentobox">
                    Overview
                  </NavigationListItem>
                  <NavigationListItem title="Strategies" href="internal/strategies">
                    Strategies
                  </NavigationListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/internal/tokens">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Tokens</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/internal/subgraphs">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Subgraphs</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </NavigationContainer>
      {children}
    </>
  )
}
