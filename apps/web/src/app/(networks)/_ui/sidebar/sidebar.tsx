'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  PopoverContent,
  classNames,
  useBreakpoint,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useRef } from 'react'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { useSidebar } from './sidebar-provider'
import { SidebarView } from './types'
import { SidebarConnectView } from './views/sidebar-connect-view'
import { SidebarPortfolioView } from './views/sidebar-portfolio-view'
import { SidebarSettingsView } from './views/sidebar-settings-view'

function ResponsiveSidebarWrapper({
  children,
  isPortfolio,
}: {
  children: ReactNode
  isPortfolio: boolean
}): ReactNode {
  const isMounted = useIsMounted()
  const { isSm } = useBreakpoint('sm')
  const { contentId, isOpen, open, close } = useSidebar()
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const interactedOutsideRef = useRef(false)
  const onOpenChange = (shouldOpen: boolean) => (shouldOpen ? open() : close())

  function onOpenAutoFocus() {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    interactedOutsideRef.current = false
  }

  function onCloseAutoFocus(event: Event) {
    event.preventDefault()
    if (!interactedOutsideRef.current) {
      returnFocusRef.current?.focus()
    }
  }

  if (!isMounted) return null

  return isSm ? (
    <PopoverContent
      id={contentId}
      aria-label="Wallet menu"
      side="bottom"
      align="end"
      collisionPadding={8}
      sideOffset={12}
      sticky="always"
      className={classNames(
        '!p-0 overflow-y-auto overscroll-contain hide-scrollbar origin-[var(--radix-popover-content-transform-origin)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 motion-reduce:!animate-none',
        '!w-[428px] max-w-[calc(100vw-16px)] !max-h-[min(704px,var(--radix-popover-content-available-height))] !rounded-3xl !bg-background !shadow-none',
        isPortfolio &&
          'h-[min(704px,var(--radix-popover-content-available-height))]',
      )}
      onOpenAutoFocus={onOpenAutoFocus}
      onCloseAutoFocus={onCloseAutoFocus}
      onInteractOutside={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('[data-sidebar-trigger]')
        ) {
          event.preventDefault()
        } else {
          interactedOutsideRef.current = true
        }
      }}
    >
      {children}
    </PopoverContent>
  ) : (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        id={contentId}
        hideClose
        className="!block !p-0 h-[calc(100dvh-16px)] overflow-y-auto overscroll-contain hide-scrollbar"
        onOpenAutoFocus={onOpenAutoFocus}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <VisuallyHidden>
          <DialogTitle>Wallet menu</DialogTitle>
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

  return (
    <ResponsiveSidebarWrapper
      isPortfolio={isConnected && view === SidebarView.Portfolio}
    >
      {content}
    </ResponsiveSidebarWrapper>
  )
}
