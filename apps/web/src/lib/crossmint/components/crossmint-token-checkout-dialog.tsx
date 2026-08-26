'use client'

import {
  Button,
  type ButtonProps,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, type ReactNode, useState } from 'react'
import {
  CrossmintTokenCheckout,
  type CrossmintTokenCheckoutProps,
} from './crossmint-token-checkout'

export interface CrossmintTokenCheckoutDialogProps
  extends Omit<
    CrossmintTokenCheckoutProps,
    'className' | 'onCancel' | 'presentation'
  > {
  children: ReactElement
  checkoutClassName?: string
  closeOnComplete?: boolean
  contentClassName?: string
  onCancel?(): void
  onOpenChange?(open: boolean): void
  open?: boolean
}

export function CrossmintTokenCheckoutDialog({
  children,
  checkoutClassName,
  closeOnComplete = false,
  contentClassName,
  onCancel,
  onComplete,
  onOpenChange,
  open,
  token,
  ...checkoutProps
}: CrossmintTokenCheckoutDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = open ?? internalOpen

  function setDialogOpen(nextOpen: boolean): void {
    if (open === undefined) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  function handleOpenChange(nextOpen: boolean): void {
    setDialogOpen(nextOpen)

    if (!nextOpen) {
      onCancel?.()
    }
  }

  function handleComplete(orderId: string): void {
    onComplete?.(orderId)

    if (closeOnComplete) {
      setDialogOpen(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={classNames(
          'max-h-[calc(100dvh-16px)] max-w-md !gap-0 overflow-y-auto !p-0',
          contentClassName,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Buy {token.symbol}</DialogTitle>
          <DialogDescription>
            Buy {token.symbol} with Crossmint and receive it in your external
            wallet.
          </DialogDescription>
        </DialogHeader>
        <CrossmintTokenCheckout
          {...checkoutProps}
          className={checkoutClassName}
          onCancel={() => handleOpenChange(false)}
          onComplete={handleComplete}
          presentation="plain"
          token={token}
        />
      </DialogContent>
    </Dialog>
  )
}

export interface CrossmintBuyButtonProps
  extends Omit<CrossmintTokenCheckoutDialogProps, 'children'> {
  buttonProps?: Omit<ButtonProps, 'children'>
  children?: ReactNode
}

export function CrossmintBuyButton({
  buttonProps,
  children,
  token,
  ...dialogProps
}: CrossmintBuyButtonProps) {
  return (
    <CrossmintTokenCheckoutDialog {...dialogProps} token={token}>
      <Button size="lg" {...buttonProps}>
        {children ?? `Buy ${token.symbol}`}
      </Button>
    </CrossmintTokenCheckoutDialog>
  )
}
