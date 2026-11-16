'use client'

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import classNames from 'classnames'
import { buttonVariants } from './button'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={classNames(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={classNames(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = buttonVariants({ variant: 'ghost' })

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={classNames(
      navigationMenuTriggerStyle,
      'focus:!bg-transparent active:!bg-muted',
      'group !gap-0.5',
      className,
    )}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={classNames(
      // Only the active panel sizes the viewport; exiting panels stay overlaid.
      'col-start-1 row-start-1 w-max overflow-y-auto max-h-[90vw] border border-accent rounded-2xl bg-secondary data-[motion^=to-]:absolute data-[motion^=to-]:left-0 data-[motion^=to-]:top-0',
      'ease-in-out data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:duration-150 data-[motion^=to-]:duration-150 data-[motion^=from-]:fade-in-0 data-[motion^=to-]:fade-out-0 data-[motion=from-end]:slide-in-from-right-2 data-[motion=from-start]:slide-in-from-left-2 data-[motion=to-end]:slide-out-to-right-2 data-[motion=to-start]:slide-out-to-left-2 motion-reduce:!animate-none',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, children, href, asChild, ...props }, ref) => {
  const isInternalLink = typeof href === 'string' && /^\/(?!\/)/.test(href)

  if (asChild || !isInternalLink) {
    return (
      <NavigationMenuPrimitive.Link
        ref={ref}
        className={classNames(className)}
        href={href}
        asChild={asChild}
        {...props}
      >
        {children}
      </NavigationMenuPrimitive.Link>
    )
  }

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={classNames(className)}
      href={href}
      asChild
      {...props}
    >
      <Link href={href}>{children}</Link>
    </NavigationMenuPrimitive.Link>
  )
})
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div
    className={classNames(
      'absolute left-0 top-full flex w-full min-w-fit justify-center',
    )}
  >
    <NavigationMenuPrimitive.Viewport
      className={classNames(
        'origin-top relative mt-1.5 grid items-start justify-items-start w-[var(--radix-navigation-menu-viewport-width,max-content)] overflow-hidden rounded-2xl bg-background dark:bg-background text-popover-foreground shadow-md transition-none',
        'ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-150 data-[state=closed]:duration-150 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 motion-reduce:!animate-none',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={classNames(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
  NavigationMenuPrimitive,
}
