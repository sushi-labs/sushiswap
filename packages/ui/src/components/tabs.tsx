'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  [
    'relative inline-flex items-center text-muted-foreground [anchor-scope:--active-tab]',
    "after:pointer-events-none after:absolute after:hidden after:invisible after:content-['']",
    'after:left-[anchor(--active-tab_left,0px)] after:w-[anchor-size(--active-tab_width,0px)]',
    'after:transition-[left,top,width,height] after:duration-200 after:ease-out motion-reduce:after:transition-none',
    'has-[[data-state=active]:disabled]:after:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'isolate justify-center rounded-full bg-muted p-0.5',
          'after:-z-10 after:rounded-full after:border after:border-accent after:bg-secondary black:after:bg-accent black:after:border-white/[0.08]',
          'after:top-[anchor(--active-tab_top,0px)] after:h-[anchor-size(--active-tab_height,0px)]',
        ],
        underline: [
          'w-full justify-start gap-8 border-b border-b-accent',
          'after:-bottom-px after:h-0.5 after:bg-pink',
        ],
      },
      animated: {
        // Keep display stable while Radix switches the active anchor.
        true: 'group/tabs-list supports-[anchor-scope:--active-tab]:after:block has-[[data-state=active]]:after:visible',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      animated: true,
    },
  },
)

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant = 'default', animated, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-variant={variant}
    className={tabsListVariants({ variant, animated, className })}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-pink disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary data-[state=active]:[anchor-name:--active-tab] data-[state=inactive]:hover:text-primary',
  {
    variants: {
      variant: {
        default: [
          'border rounded-full px-3 py-1.5 text-sm data-[state=inactive]:border-transparent data-[state=active]:border-accent data-[state=active]:bg-secondary black:data-[state=active]:bg-accent black:data-[state=active]:border-white/[0.08]',
          'supports-[anchor-scope:--active-tab]:group-data-[variant=default]/tabs-list:data-[state=active]:bg-transparent supports-[anchor-scope:--active-tab]:group-data-[variant=default]/tabs-list:data-[state=active]:border-transparent',
        ],
        underline: [
          '-mb-px rounded-none border-b-2 border-b-transparent bg-transparent px-0 py-1.5 text-muted-foreground data-[state=active]:border-b-pink',
          'supports-[anchor-scope:--active-tab]:group-data-[variant=underline]/tabs-list:data-[state=active]:border-b-transparent',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={tabsTriggerVariants({ variant, className })}
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
