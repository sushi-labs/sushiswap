'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
  LinkInternal,
  Loader,
  classNames,
} from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/check-mark-icon'
import { FailedMarkIcon } from '@sushiswap/ui/icons/failed-mark-icon'
import { type ReactNode, useMemo } from 'react'
import { type ChainId, type TxHashFor, getChainById } from 'sushi'

import { DialogType, useDialog } from './dialog-provider'

interface DialogConfirmProps<TChainId extends ChainId>
  extends DialogContentProps {
  chainId: TChainId
  testId: string
  successMessage: ReactNode
  buttonLink?: string
  buttonText?: string
  txHash: TxHashFor<TChainId> | undefined
  status: 'pending' | 'success' | 'error'
  successTitle?: ReactNode
}

export function DialogConfirm<TChainId extends ChainId>({
  chainId,
  testId,
  successMessage,
  buttonText = 'Close',
  buttonLink,
  status,
  txHash,
  variant,
  successTitle = 'Success',
  ...contentProps
}: DialogConfirmProps<TChainId>) {
  const { open, setOpen } = useDialog(DialogType.Confirm)
  const txHashUrl = useMemo(() => {
    if (!txHash) return ''
    return getChainById(chainId).getTransactionUrl(txHash)
  }, [chainId, txHash])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        variant={variant}
        {...contentProps}
        className={classNames(
          variant === 'perps' && 'max-w-md',
          contentProps.className,
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={classNames(
              variant === 'perps' && '!text-perps-muted',
              'md:!text-2xl !text-left',
            )}
          >
            {status === 'pending' ? (
              <div className="flex items-center gap-2">
                <Loader size={42} strokeWidth={1.5} className="!text-pink" />
                <Dots>Confirming</Dots>
              </div>
            ) : status === 'success' ? (
              <div className="flex items-center gap-2">
                <CheckMarkIcon width={42} height={42} />
                <h2>{successTitle}</h2>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FailedMarkIcon width={42} height={42} />
                <h2>Something went wrong</h2>
              </div>
            )}
          </DialogTitle>
          <DialogDescription
            className={classNames(
              'font-medium',
              variant === 'perps' && '!text-perps-muted-50',
            )}
            aria-describedby="dialog-description"
          />
          <div className="py-6 flex justify-center">
            {status === 'pending' ? (
              <p>
                Waiting for your{' '}
                {txHashUrl ? (
                  <a
                    target="_blank"
                    href={txHashUrl}
                    className="cursor-pointer text-pink hover:underline"
                    rel="noreferrer"
                  >
                    transaction
                  </a>
                ) : (
                  'transaction'
                )}{' '}
                to be confirmed on {getChainById(chainId).name}.
              </p>
            ) : status === 'success' ? (
              <>{successMessage}</>
            ) : (
              <a
                target="_blank"
                href={txHashUrl}
                className="cursor-pointer text-pink hover:underline"
                rel="noreferrer"
              >
                Something went wrong confirming the transaction.
              </a>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                testId={testId}
                asChild={!!buttonLink}
                fullWidth
                size="xl"
                variant={variant === 'perps' ? 'perps-default' : undefined}
              >
                {buttonLink ? (
                  <LinkInternal href={buttonLink}>{buttonText}</LinkInternal>
                ) : (
                  <>{buttonText}</>
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
DialogConfirm.displayName = 'DialogConfirm'
