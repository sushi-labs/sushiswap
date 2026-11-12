'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

const toggleVariants = cva(
  'inline-flex gap-2 items-center justify-center rounded-full text-sm font-medium transition-colors data-[state=on]:bg-secondary data-[state=on]:text-primary disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-pink',
  {
    variants: {
      variant: {
        default:
          'bg-transparent data-[state=on]:border-accent border data-[state=off]:border-transparent data-[state=off]:text-muted-foreground data-[state=off]:hover:text-primary',
        outline:
          'bg-transparent !border border-accent hover:bg-secondary hover:text-accent-foreground',
      },
      size: {
        xs: 'h-[26px] px-3 text-xs',
        default: 'h-9 px-4',
        sm: 'h-8 px-3.5',
        lg: 'h-10 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  testId?: string
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ testId, id, className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    id={id}
    {...(testId || id ? { 'testdata-id': `${testId || id}-button` } : {})}
    ref={ref}
    className={classNames(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div
    className={classNames('flex rounded-full bg-muted p-0.5 gap-1', className)}
    ref={ref}
    {...props}
  />
))

ToggleGroup.displayName = 'ToggleGroup'

export { Toggle, toggleVariants, ToggleGroup }
