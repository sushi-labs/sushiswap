import {
  Button,
  DialogClose,
  DialogContent,
  DialogCustom,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogType,
  Dots,
  Loader,
} from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/icons/FailedMarkIcon'
import { type ChainId, getChainById } from 'sushi'

export const KinesisSwapConfirmationDialog = ({
  onClose,
  dstChainId,
  successMessage,
  status,
}: {
  onClose: () => void
  dstChainId: ChainId | undefined
  successMessage: string
  status: 'pending' | 'success' | 'error'
}) => {
  return (
    <DialogCustom dialogType={DialogType.Confirm}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {status === 'pending' ? (
              <Dots>Confirming Cross-Chain Swap</Dots>
            ) : status === 'success' ? (
              'Success!'
            ) : (
              'Oops!'
            )}
          </DialogTitle>
          <DialogDescription className="font-medium">
            {status === 'pending' ? (
              <>
                Waiting for your transaction to be confirmed
                {dstChainId ? ` on ${getChainById(dstChainId)?.name}` : ''}.
              </>
            ) : status === 'success' ? (
              <div>{successMessage}</div>
            ) : (
              <div>Something went wrong...</div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex justify-center">
          {status === 'pending' ? (
            <Loader size={132} strokeWidth={1} className="!text-blue" />
          ) : status === 'success' ? (
            <CheckMarkIcon width={132} height={132} />
          ) : (
            <FailedMarkIcon width={132} height={132} />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              size="xl"
              fullWidth
              id="swap-dialog-close"
              onClick={() => {
                onClose()
              }}
            >
              {status === 'error'
                ? 'Try again'
                : status === 'success'
                  ? 'Make another swap'
                  : 'Close'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </DialogCustom>
  )
}
