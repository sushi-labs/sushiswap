'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkExternal,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
        <div>
          <SheetHeader className="p-4 !text-left">
            <SheetTitle>Connect</SheetTitle>
            <Disclaimer />
          </SheetHeader>
          {open ? <ConnectModalContent /> : null}
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="!p-0 max-h-[calc(100%-16px)]">
        <div>
          <DialogHeader className="p-4 !text-left">
            <DialogTitle>Connect</DialogTitle>
            <Disclaimer />
          </DialogHeader>
          {open ? <ConnectModalContent /> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ConnectModalContent = dynamic(() => import('./connect-wallet-options'), {
  ssr: false,
})

const Disclaimer = () => {
  return (
    <div className="text-sm">
      By connecting your wallet, you agree to Sushi Labs&apos;{' '}
      <LinkExternal href="/legal/terms-of-service">
        Terms of Service
      </LinkExternal>{' '}
      and{' '}
      <LinkExternal href="/legal/privacy-policy">Privacy Policy</LinkExternal>
    </div>
  )
}
