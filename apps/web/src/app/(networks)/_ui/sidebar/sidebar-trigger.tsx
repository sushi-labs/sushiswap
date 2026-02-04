import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

export const SidebarTrigger = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren
>(function SidebarTrigger({ children }, ref) {
  return (
    <Slot ref={ref} data-sidebar-trigger>
      {children}
    </Slot>
  )
})
