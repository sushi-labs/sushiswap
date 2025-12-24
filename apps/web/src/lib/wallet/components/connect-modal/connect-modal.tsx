'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  LinkExternal,
  Sheet,
  SheetContent,
  SheetFooter,
  useBreakpoint,
} from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

type Props = {
  open: boolean
  onOpenChange(open: boolean): void
}

export const ConnectModal: FC<Props> = ({ open, onOpenChange }) => {
  const { isSm } = useBreakpoint('sm')

  return isSm ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent hideClose className="!p-0">
        {open ? <ConnectModalContent /> : null}
        <SheetFooter>
          <ConnectModalFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="!p-0 h-[calc(100%-16px)]">
        <DialogTitle>Connect Wallet</DialogTitle>
        {open ? <ConnectModalContent /> : null}
        <DialogFooter>
          <ConnectModalFooter />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ConnectModalContent = dynamic(() => import('./connect-wallet-options'), {
  ssr: false,
})

const ConnectModalFooter = () => {
  return (
    <div className="text-sm text-center">
      By connecting your wallet, you agree to Sushi Labs&apos;{' '}
      <LinkExternal href="/legal/terms-of-service">
        Terms of Service
      </LinkExternal>{' '}
      and{' '}
      <LinkExternal href="/legal/privacy-policy">Privacy Policy</LinkExternal>
    </div>
  )
}
