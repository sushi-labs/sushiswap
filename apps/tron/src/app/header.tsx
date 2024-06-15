'use client'

import { classNames } from '@sushiswap/ui'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import Link from 'next/link'
import React, { FC } from 'react'

interface NavigationListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string
}

const NavigationListItem: FC<NavigationListItemProps> = ({
  className,
  title,
  children,
  href,
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={classNames(
            'cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export const Navigation: FC = () => {
  return (
    <div className="px-4 sticky flex items-center flex-grow gap-4 top-0 z-50 min-h-[56px] max-h-[56px] h-[56px] bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <SushiIcon width={24} height={24} />
      <div className="flex items-center justify-between flex-grow gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="hidden lg:block">
              <NavigationMenuLink
                href="/swap"
                className={navigationMenuTriggerStyle()}
              >
                Swap
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="hidden lg:block">
              <NavigationMenuLink
                href="/pool"
                className={navigationMenuTriggerStyle()}
              >
                Pool
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden lg:block">
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="min-w-[240px] gap-3 p-4">
                  <NavigationListItem
                    key="pools"
                    title="Pools"
                    href="/explore/pools"
                  >
                    Pools
                  </NavigationListItem>
                  <NavigationListItem
                    key="tokens"
                    title="Tokens"
                    href="/explore/tokens"
                  >
                    Tokens
                  </NavigationListItem>
                  <NavigationListItem
                    key="transactions"
                    title="Transactions"
                    href="/explore/transactions"
                  >
                    Transactions
                  </NavigationListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">Wallet Connector</div>
      </div>
    </div>
  )
}

export const Header: FC = () => {
  return <Navigation />
}
