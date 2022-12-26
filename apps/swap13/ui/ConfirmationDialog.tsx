import { BarLoader } from '@sushiswap/ui13/components/BarLoader'
import { Button } from '@sushiswap/ui13/components/button'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { Dots } from '@sushiswap/ui13/components/Dots'
import { CheckMarkIcon } from '@sushiswap/ui13/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui13/components/icons/FailedMarkIcon'
import { Loader } from '@sushiswap/ui13/components/Loader'
import { FC, useEffect, useState } from 'react'

import { useSwapState } from './TradeProvider'

interface ConfirmationDialogProps {
  open: boolean
  setOpen(open: boolean): void
}

enum ConfirmationDialogState {
  Pending,
  Success,
  Failed,
  Sign,
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ open, setOpen }) => {
  const { token0, token1 } = useSwapState()
  const [state, setState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Sign)

  // TODO: For testing remove
  useEffect(() => {
    if (state === ConfirmationDialogState.Pending && open) {
      setTimeout(() => {
        setState(ConfirmationDialogState.Failed)
      }, 2000)
    }
  }, [open, state])
  useEffect(() => {
    if (state === ConfirmationDialogState.Sign && open) {
      setTimeout(() => {
        setState(ConfirmationDialogState.Pending)
      }, 2000)
    }
  }, [open, state])

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Dialog.Content>
        <div className="flex flex-col gap-5 items-center justify-center">
          {[ConfirmationDialogState.Failed, ConfirmationDialogState.Success].includes(state) ? (
            <BarLoader transitionDuration={4000} onComplete={() => setOpen(false)} />
          ) : (
            <div className="h-1" />
          )}
          <div className="py-5">
            {[ConfirmationDialogState.Pending, ConfirmationDialogState.Sign].includes(state) ? (
              <Loader size={100} strokeWidth={1} />
            ) : state === ConfirmationDialogState.Success ? (
              <CheckMarkIcon width={100} height={100} />
            ) : (
              <FailedMarkIcon width={100} height={100} />
            )}
          </div>
          <div className="flex flex-col items-center">
            {state === ConfirmationDialogState.Sign ? (
              <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                Please sign order with your wallet.
              </h1>
            ) : state === ConfirmationDialogState.Pending ? (
              <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                Waiting for your{' '}
                <span className="text-blue hover:underline cursor-pointer">
                  <Dots>transaction</Dots>
                </span>{' '}
                to be confirmed on the blockchain.
              </h1>
            ) : state === ConfirmationDialogState.Success ? (
              <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                You bought
                <span className="text-blue px-0.5">130.3 {token1.symbol}</span> with{' '}
                <span className="text-red px-0.5">0.00554 {token0.symbol}.</span>
              </h1>
            ) : (
              <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                <span className="text-red">Oops!</span> Your{' '}
                <span className="text-blue hover:underline cursor-pointer">transaction</span> failed
              </h1>
            )}
          </div>
          <Button fullWidth color="blue" variant="outlined" size="xl" onClick={() => setOpen(false)}>
            {state === ConfirmationDialogState.Success
              ? 'Make another swap'
              : state === ConfirmationDialogState.Failed
              ? 'Try again'
              : 'Close'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
