'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { DialogType, useDialog } from 'src/lib/transaction-dialog'
import {
  Divider,
  GetStateComponent,
  type StepState,
  failedState,
  finishedState,
} from './lifi/confirmation-dialog'

export function CrossChainSwapConfirmationDialog({
  stepStates,
  description,
  children,
  closeDisabled = false,
}: {
  stepStates: { source: StepState; bridge: StepState; dest: StepState }
  description: ReactNode
  children?: ReactNode
  closeDisabled?: boolean
}): ReactNode {
  const { open, setOpen } = useDialog(DialogType.Confirm)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Cross-chain swap</DialogTitle>
          <DialogDescription asChild>
            <div>{description}</div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="py-5">
            <div className="relative flex gap-3">
              <GetStateComponent index={1} state={stepStates.source} />
              <Divider />
              <GetStateComponent index={2} state={stepStates.bridge} />
              <Divider />
              <GetStateComponent index={3} state={stepStates.dest} />
            </div>
          </div>
        </div>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              size="xl"
              fullWidth
              id="swap-dialog-close"
              disabled={closeDisabled}
            >
              {failedState(stepStates)
                ? 'Try again'
                : finishedState(stepStates)
                  ? 'Make another swap'
                  : 'Close'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
