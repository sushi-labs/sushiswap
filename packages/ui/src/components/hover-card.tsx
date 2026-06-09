'use client'

import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import type * as React from 'react'

import classNames from 'classnames'

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={classNames(
          'border border-accent z-50 overflow-hidden rounded-xl paper p-4 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'bg-white/50',
          'dark:bg-slate-800/50',
          'black:bg-black/50',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

// const HoverCardContent = React.forwardRef<
//   React.ElementRef<typeof HoverCardPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
// >(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
//   <HoverCardPrimitive.Content
//     ref={ref}
//     align={align}
//     sideOffset={sideOffset}
//     className={classNames(
//       'border border-accent z-50 overflow-hidden rounded-xl paper p-4 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
//       'bg-white/50',
//       'dark:bg-slate-800/50',
//       'black:bg-black/50',
//       className,
//     )}
//     {...props}
//   />
// ))
// HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardContent, HoverCardPrimitive, HoverCardTrigger }
