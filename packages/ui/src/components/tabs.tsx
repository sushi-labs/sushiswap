'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva('inline-flex items-center text-muted-foreground', {
  variants: {
    variant: {
      default: 'justify-center rounded-full bg-muted p-0.5',
      underline: 'w-full justify-start gap-8 border-b border-b-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={tabsListVariants({ variant, className })}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-pink disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary data-[state=inactive]:hover:text-primary',
  {
    variants: {
      variant: {
        default:
          'border rounded-full px-3 py-1.5 text-sm data-[state=inactive]:border-transparent data-[state=active]:border-accent data-[state=active]:bg-secondary black:data-[state=active]:bg-accent black:data-[state=active]:border-white/[0.08]',
        underline:
          '-mb-px rounded-none border-b-2 border-b-transparent bg-transparent px-0 py-1.5 text-muted-foreground data-[state=active]:border-b-pink',
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
