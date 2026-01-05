'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetTitle,
  useBreakpoint,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useMemo } from 'react'
import { PortfolioDefaultView } from 'src/lib/wagmi/components/user-portfolio/portfolio-default-view'
import { PortfolioSettingsView } from 'src/lib/wagmi/components/user-portfolio/portfolio-settings-view'
import { useAccount } from 'src/lib/wallet'
import { SidebarConnectView } from 'src/lib/wallet/components/sidebar-connect-view'
import { useSidebar } from './sidebar-provider'
import { SidebarView } from './types'

const ResponsiveSidebarWrapper: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { isSm } = useBreakpoint('sm')
  const { isOpen, close } = useSidebar()
  const onOpenChange = (open: boolean) => !open && close()

  return isSm ? (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent hideClose className="!p-0">
        <VisuallyHidden>
          <SheetTitle>Sidebar</SheetTitle>
        </VisuallyHidden>
        {children}
      </SheetContent>
    </Sheet>
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
      case SidebarView.Settings:
        return <PortfolioSettingsView />
      default:
        return <PortfolioDefaultView />
    }
  }, [view, isConnected])

  return <ResponsiveSidebarWrapper>{content}</ResponsiveSidebarWrapper>
}
