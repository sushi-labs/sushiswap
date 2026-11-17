'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

const toggleVariants = cva(
  [
    'inline-flex gap-2 items-center cursor-pointer justify-center rounded-full text-sm font-medium transition-colors data-[state=on]:bg-secondary data-[state=on]:text-primary disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-pink',
    'data-[state=on]:[anchor-name:--active-toggle]',
    'supports-[anchor-scope:--active-toggle]:group-data-[animated=true]/toggle-group:data-[state=on]:bg-transparent supports-[anchor-scope:--active-toggle]:group-data-[animated=true]/toggle-group:data-[state=on]:border-transparent',
  ],
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
  React.ComponentPropsWithoutRef<'div'> & {
    /** Disable the shared indicator for groups with multiple pressed toggles. */
    animated?: boolean
  }
>(({ className, animated = true, ...props }, ref) => (
  <div
    data-animated={animated}
    className={classNames(
      'group/toggle-group relative isolate flex rounded-full bg-muted p-0.5 gap-1 [anchor-scope:--active-toggle]',
      "after:pointer-events-none after:absolute after:-z-10 after:hidden after:rounded-full after:border after:border-accent after:bg-secondary after:content-['']",
      'after:left-[anchor(--active-toggle_left,0px)] after:top-[anchor(--active-toggle_top,0px)] after:w-[anchor-size(--active-toggle_width,0px)] after:h-[anchor-size(--active-toggle_height,0px)]',
      'after:transition-[left,top,width,height] after:duration-200 after:ease-out motion-reduce:after:transition-none',
      'supports-[anchor-scope:--active-toggle]:data-[animated=true]:has-[[data-state=on]]:after:block has-[[data-state=on]:disabled]:after:opacity-50',
      className,
    )}
    ref={ref}
    {...props}
  />
))

ToggleGroup.displayName = 'ToggleGroup'

export { Toggle, toggleVariants, ToggleGroup }
