import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { useSidebar } from './sidebar-provider'

export const SidebarTrigger = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren
>(function SidebarTrigger({ children }, ref) {
  const { contentId, isOpen } = useSidebar()

  return (
    <Slot
      ref={ref}
      data-sidebar-trigger
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
    >
      {children}
    </Slot>
  )
})
