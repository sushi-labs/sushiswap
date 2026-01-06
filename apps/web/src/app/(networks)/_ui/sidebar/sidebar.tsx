'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Popover,
  PopoverContent,
  PopoverPrimitive,
  useBreakpoint,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useMemo } from 'react'
import { useAccount } from 'src/lib/wallet'
import { useSidebar } from './sidebar-provider'
import { SidebarView } from './types'
import { SidebarConnectView } from './views/sidebar-connect-view'
import { SidebarPortfolioView } from './views/sidebar-portfolio-view'
import { SidebarSettingsView } from './views/sidebar-settings-view'

const ResponsiveSidebarWrapper: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { isSm } = useBreakpoint('sm')
  const { isOpen, close } = useSidebar()
  const onOpenChange = (open: boolean) => !open && close()

  return isSm ? (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor asChild>
        <span aria-hidden className="fixed top-14 right-4 bottom-4 w-px h-px" />
      </PopoverPrimitive.Anchor>
      <PopoverContent className="!p-0 h-[calc(100vh-16px)] !w-80">
        {children}
      </PopoverContent>
    </Popover>
  ) : (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="!p-0 h-[calc(100%-16px)]">
        <VisuallyHidden>
          <DialogTitle>Sidebar</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export const Sidebar = () => {
  const { view } = useSidebar()
  const account = useAccount()

  const isConnected = Boolean(account)

  const content = useMemo(() => {
    if (!isConnected) {
      return <SidebarConnectView />
    }

    switch (view) {
      case SidebarView.Connect:
        return <SidebarConnectView />
      case SidebarView.Settings:
        return <SidebarSettingsView />
      default:
        return <SidebarPortfolioView />
    }
  }, [view, isConnected])

  return <ResponsiveSidebarWrapper>{content}</ResponsiveSidebarWrapper>
}
