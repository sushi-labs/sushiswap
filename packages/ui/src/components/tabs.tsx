'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import classNames from 'classnames'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={classNames(
      'border border-accent inline-flex h-10 items-center justify-center rounded-lg bg-background p-1 px-0.5 text-muted-foreground',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={classNames(
      'border rounded-lg inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-blue disabled:pointer-events-none disabled:opacity-50',
      'data-[state=inactive]:border-transparent data-[state=active]:shadow-sm data-[state=active]:border-accent data-[state=active]:bg-white data-[state=active]:text-primary',
      'dark:data-[state=active]:bg-accent',
      'black:data-[state=active]:bg-accent black:data-[state=active]:border-white/[0.08]',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    tabIndex={-1}
    ref={ref}
    className={classNames('mt-2 focus-visible:none', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsContent, TabsList, TabsPrimitive, TabsTrigger }
