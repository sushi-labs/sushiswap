'use client'

import { Dialog, type DialogPrimitive } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import type * as React from 'react'

import { DialogType, useDialog } from './dialog-provider'

interface DialogReviewProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>,
    'children' | 'open'
  > {
  children: ({ confirm }: { confirm(): void }) => ReactNode
}

export const DialogReview: FC<DialogReviewProps> = ({ children, ...props }) => {
  const { confirm, open, setOpen } = useDialog(DialogType.Review)
  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      {children({ confirm })}
    </Dialog>
  )
}
DialogReview.displayName = 'DialogReview'
