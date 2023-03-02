'use client'

import { BarLoader } from '@sushiswap/ui/future/components/BarLoader'
import { Button } from '@sushiswap/ui/future/components/button'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { CheckMarkIcon } from '@sushiswap/ui/future/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/future/components/icons/FailedMarkIcon'
import { Loader } from '@sushiswap/ui/future/components/Loader'
import { FC, ReactNode, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useAccount, useContractWrite, usePrepareContractWrite, UserRejectedRequestError } from 'wagmi'
import { routeProcessorAbi } from '@sushiswap/abi'
import { useTrade } from '../lib/useTrade'
import { SendTransactionResult } from 'wagmi/actions'
import { useBalances, useCreateNotification } from '@sushiswap/react-query'
import { createToast, NotificationData } from '@sushiswap/ui/future/components/toast'
import { AppType } from '@sushiswap/ui/types'
import { Native } from '@sushiswap/currency'
import { Chain } from '@sushiswap/chain'
import { routeProcessorAddress } from '@sushiswap/route-processor'

interface ConfirmationDialogProps {
  children({
    onClick,
    isWritePending,
  }: {
    error: Error | null
    onClick(): void
    isError: boolean
    isWritePending: boolean
    isLoading: boolean
    isConfirming: boolean
  }): ReactNode
}

enum ConfirmationDialogState {
  Undefined,
  Pending,
  Success,
  Failed,
  Sign,
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ children }) => {
  const { address } = useAccount()
  const { setReview } = useSwapActions()
  const { appType, network0, token0, token1, review } = useSwapState()
  const { data: trade } = useTrade({ crossChain: false })
  const { refetch: refetchNetwork0Balances } = useBalances({ account: address, chainId: network0 })
  const { mutate: storeNotification } = useCreateNotification({ account: address })

  const [open, setOpen] = useState(false)
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)

  const { config, isError, error } = usePrepareContractWrite({
    chainId: network0,
    address: routeProcessorAddress[network0],
    abi: routeProcessorAbi,
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled: Boolean(trade?.writeArgs) && appType === AppType.Swap,
    overrides: trade?.overrides,
  })

  const isWrap =
    appType === AppType.Swap && token0?.isNative && token1?.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1?.isNative && token0?.wrapped.address === Native.onChain(network0).wrapped.address

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !network0 || !data) return

      const ts = new Date().getTime()
      const notificationData: NotificationData = {
        type: 'swap',
        chainId: network0,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `${isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'} ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.toSignificant(6)} ${
            trade.amountOut?.currency.symbol
          }`,
          completed: `${isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'} ${trade.amountIn?.toSignificant(6)} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.toSignificant(6)} ${
            trade.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to ${isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'}} ${
            trade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${trade.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      }

      storeNotification(createToast(notificationData))
    },
    [trade, network0, isWrap, isUnwrap, storeNotification]
  )

  const {
    writeAsync,
    isLoading: isWritePending,
    data,
  } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      setReview(false)

      data
        .wait()
        .then(() => setDialogState(ConfirmationDialogState.Success))
        .catch(() => setDialogState(ConfirmationDialogState.Failed))
        .finally(() => refetchNetwork0Balances())
    },
    onSettled,
  })

  const onComplete = useCallback(() => {
    setOpen(false)

    // Reset after half a second because of dialog close animation
    setTimeout(() => {
      setDialogState(ConfirmationDialogState.Undefined)
    }, 500)
  }, [])

  const onClick = useCallback(() => {
    if (dialogState === ConfirmationDialogState.Pending) {
      setOpen(true)
    } else if (review) {
      const promise = writeAsync?.()
      if (promise) {
        promise
          .then(() => {
            setDialogState(ConfirmationDialogState.Pending)
            setOpen(true)
          })
          .catch((e: unknown) => {
            if (e instanceof UserRejectedRequestError) onComplete()
            else setDialogState(ConfirmationDialogState.Failed)
          })
      }
    } else {
      setReview(true)
    }
  }, [dialogState, onComplete, review, setReview, writeAsync])

  return (
    <>
      {children({
        onClick,
        isWritePending,
        isLoading: !writeAsync,
        error,
        isError,
        isConfirming: dialogState === ConfirmationDialogState.Pending,
      })}
      <Dialog open={open} unmount={false} onClose={() => setOpen(false)}>
        <Dialog.Content>
          <div className="flex flex-col items-center justify-center gap-5">
            {[ConfirmationDialogState.Failed, ConfirmationDialogState.Success].includes(dialogState) ? (
              <BarLoader transitionDuration={4000} onComplete={onComplete} />
            ) : (
              <div className="h-1" />
            )}
            <div className="py-5">
              {dialogState === ConfirmationDialogState.Pending || isWritePending ? (
                <Loader size={100} strokeWidth={1} className="!text-blue" />
              ) : dialogState === ConfirmationDialogState.Success ? (
                <CheckMarkIcon width={100} height={100} />
              ) : (
                <FailedMarkIcon width={100} height={100} />
              )}
            </div>
            <div className="flex flex-col items-center">
              {dialogState === ConfirmationDialogState.Sign ? (
                <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-medium leading-normal">
                  Please sign order with your wallet.
                </h1>
              ) : dialogState === ConfirmationDialogState.Pending ? (
                <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-medium leading-normal">
                  Waiting for your{' '}
                  <a
                    target="_blank"
                    href={data?.hash ? Chain.from(network0).getTxUrl(data.hash) : ''}
                    className="cursor-pointer text-blue hover:underline"
                    rel="noreferrer"
                  >
                    <Dots>transaction</Dots>
                  </a>{' '}
                  to be confirmed on the blockchain.
                </h1>
              ) : dialogState === ConfirmationDialogState.Success ? (
                <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-semibold">
                  You {isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'}
                  <span className="text-red px-0.5">
                    {trade?.amountIn?.toSignificant(6)} {token0?.symbol}
                  </span>{' '}
                  {isWrap ? 'to' : isUnwrap ? 'to' : 'for'}{' '}
                  <span className="text-blue px-0.5">
                    {trade?.amountOut?.toSignificant(6)} {token1?.symbol}.
                  </span>
                </h1>
              ) : (
                <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-semibold">
                  <span className="text-red">Oops!</span> Your{' '}
                  <span className="cursor-pointer text-blue hover:underline">transaction</span> failed
                </h1>
              )}
            </div>
            <Button fullWidth color="blue" variant="outlined" size="xl" onClick={() => setOpen(false)}>
              {dialogState === ConfirmationDialogState.Success
                ? 'Make another swap'
                : dialogState === ConfirmationDialogState.Failed
                ? 'Try again'
                : 'Close'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
