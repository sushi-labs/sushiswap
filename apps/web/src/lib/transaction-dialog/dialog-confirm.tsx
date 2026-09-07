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
            className={classNames(variant === 'perps' && '!text-perps-muted')}
          >
            {status === 'pending' ? (
              <Dots>Confirming</Dots>
            ) : status === 'success' ? (
              'Success!'
            ) : (
              'Oops!'
            )}
          </DialogTitle>
          <DialogDescription
            className={classNames(
              'font-medium',
              variant === 'perps' && '!text-perps-muted-50',
            )}
          >
            {status === 'pending' ? (
              <>
                Waiting for your{' '}
                <a
                  target="_blank"
                  href={txHashUrl}
                  className="cursor-pointer text-blue hover:underline"
                  rel="noreferrer"
                >
                  transaction
                </a>{' '}
                to be confirmed on the blockchain.
              </>
            ) : status === 'success' ? (
              <a
                target="_blank"
                href={txHashUrl}
                className="cursor-pointer text-blue hover:underline"
                rel="noreferrer"
              >
                {successMessage}
              </a>
            ) : (
              <a
                target="_blank"
                href={txHashUrl}
                className="cursor-pointer text-blue hover:underline"
                rel="noreferrer"
              >
                Something went wrong...
              </a>
            )}
          </DialogDescription>
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
