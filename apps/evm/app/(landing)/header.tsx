'use client'

import {
  Button,
  Container,
  EXPLORE_NAVIGATION_LINKS,
  NavigationContainer,
  NavigationListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  OnramperButton,
  TOOLS_NAVIGATION_LINKS,
} from '@sushiswap/ui'
import Link from 'next/link'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <Container maxWidth="5xl" className="mx-auto">
      <NavigationContainer variant="transparent">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="block md:hidden">
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[400px] gap-3 p-4">
                  {EXPLORE_NAVIGATION_LINKS.map((component) => (
                    <NavigationListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </NavigationListItem>
                  ))}
                  <OnramperButton>
                    <NavigationListItem title="Buy Crypto">Need to buy some more crypto?</NavigationListItem>
                  </OnramperButton>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <Link href="/swap">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Swap</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <Link href="/pools">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pools</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <Link href="/furo">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pay</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[400px] gap-3 p-4">
                  {TOOLS_NAVIGATION_LINKS.map((component) => (
                    <NavigationListItem key={component.title} title={component.title} href={component.href}>
                      {component.description}
                    </NavigationListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Link href="/swap" legacyBehavior passHref>
          <a>
            <Button asChild>Enter App</Button>
          </a>
        </Link>
      </NavigationContainer>
    </Container>
  )
}
