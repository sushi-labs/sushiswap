import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

import { classNames, navigationMenuTriggerStyle, SushiIcon } from '../index'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'
import { OnramperButton } from './onramper'

const EXPLORE_NAVIGATION_LINKS: { title: string; href: string; description: string }[] = [
  {
    title: 'Swap',
    href: '/swap',
    description: 'The easiest way to trade.',
  },
  {
    title: 'Pools',
    href: '/pools',
    description: 'Earn fees by providing liquidity.',
  },
  {
    title: 'Pay',
    href: '/furo',
    description: 'Automate salaries and vesting schedules.',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    description: 'Find the best opportunities',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Stay up to date with the latest product developments at Sushi.',
  },
  {
    title: 'Academy',
    href: '/academy',
    description: 'Everything you need to get up to speed with DeFi.',
  },
]

const TOOLS_NAVIGATION_LINKS: { title: string; href: string; description: string }[] = [
  {
    title: 'Analytics',
    href: '/analytics',
    description: 'Find the best opportunities',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Stay up to date with the latest product developments at Sushi.',
  },
  {
    title: 'Academy',
    href: '/academy',
    description: 'Everything you need to get up to speed with DeFi.',
  },
  {
    title: 'Forum & Proposals',
    href: 'https://forum.sushi.com',
    description: 'View and discuss proposals for SushiSwap.',
  },
  {
    title: 'Participate',
    href: 'https://snapshot.org/#/sushigov.eth',
    description: 'As a Sushi holder, you can vote on proposals to shape the future of SushiSwap.',
  },
]

const navigationContainerVariants = cva(
  'px-4 sticky flex items-center flex-grow gap-4 top-0 z-50 min-h-[56px] max-h-[56px] h-[56px]',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800',
        transparent: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface NavContainerProps extends VariantProps<typeof navigationContainerVariants> {
  children: React.ReactNode
}

const NavigationContainer: React.FC<NavContainerProps> = ({ children, variant }) => {
  return (
    <div className={navigationContainerVariants({ variant })}>
      <SushiIcon width={24} height={24} />
      <div className="flex items-center justify-between flex-grow gap-4">{children}</div>
    </div>
  )
}

interface NavProps extends VariantProps<typeof navigationContainerVariants> {
  rightElement?: React.ReactNode
  legacyBehavior?: boolean
}

const Navigation: React.FC<NavProps> = ({ rightElement, variant, legacyBehavior = false }) => {
  return (
    <NavigationContainer variant={variant}>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="block md:hidden">
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="min-w-[240px] gap-3 p-4">
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
            {legacyBehavior ? (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/swap">Swap</a>
              </NavigationMenuLink>
            ) : (
              <Link href="/swap">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Swap</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            {legacyBehavior ? (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/pools">Pools</a>
              </NavigationMenuLink>
            ) : (
              <Link href="/pools">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pools</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            {legacyBehavior ? (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="/furo">Pay</a>
              </NavigationMenuLink>
            ) : (
              <Link href="/furo">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pay</NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[400px] gap-3 p-4">
                {TOOLS_NAVIGATION_LINKS.map((component) => (
                  <NavigationListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                    legacyBehavior={legacyBehavior}
                  >
                    {component.description}
                  </NavigationListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden md:block">
            <OnramperButton>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Buy Crypto</NavigationMenuLink>
            </OnramperButton>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2">{rightElement}</div>
    </NavigationContainer>
  )
}

interface NavigationListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  legacyBehavior?: boolean
}

const NavigationListItem = React.forwardRef<React.ElementRef<'a'>, NavigationListItemProps>(
  ({ className, title, children, legacyBehavior = false, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          {legacyBehavior || !href ? (
            <a
              ref={ref}
              className={classNames(
                'cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">{children}</p>
            </a>
          ) : (
            <Link
              href={href}
              className={classNames(
                'cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                className
              )}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">{children}</p>
            </Link>
          )}
        </NavigationMenuLink>
      </li>
    )
  }
)

NavigationListItem.displayName = 'NavListItem'

export { EXPLORE_NAVIGATION_LINKS, Navigation, NavigationContainer, NavigationListItem, TOOLS_NAVIGATION_LINKS }
