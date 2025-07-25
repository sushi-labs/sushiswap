'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

import classNames from 'classnames'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      children,
      className = '',
      align = 'center',
      collisionPadding = 8,
      sideOffset = 8,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        className={classNames(
          'border border-accent max-h-[var(--radix-popper-available-height)] z-50 w-72 rounded-md paper rounded-xl p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'bg-white/50',
          'dark:bg-slate-800/50',
          'black:bg-black/60',
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverContent, PopoverPrimitive, PopoverTrigger }
