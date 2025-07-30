'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import classNames from 'classnames'

const toggleVariants = cva(
  'inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-blue',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'bg-transparent !border border-accent hover:bg-secondary hover:text-accent-foreground',
        trade2: classNames(
          'h-8 font-medium rounded-md data-[state=on]:!text-blue dark:data-[state=on]:!text-skyblue bg-transparent text-slate-900 dark:text-slate-100',
          'hover:ui-bg-secondary',
          'data-[state=on]:!bg-blue/10 dark:data-[state=on]:!bg-skyblue/10',
        ),
      },
      size: {
        xs: 'h-[26px] px-2 text-xs rounded-md',
        default: 'h-10 px-3 rounded-xl',
        sm: 'h-9 px-2.5 rounded-xl',
        lg: 'h-11 px-5 rounded-xl',
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
    testdata-id={`${testId || id}-button`}
    ref={ref}
    className={classNames(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
