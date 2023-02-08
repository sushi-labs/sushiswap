'use client'

import { BarLoader } from '@sushiswap/ui13/components/BarLoader'
import { Button } from '@sushiswap/ui13/components/button'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { Dots } from '@sushiswap/ui13/components/Dots'
import { CheckMarkIcon } from '@sushiswap/ui13/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui13/components/icons/FailedMarkIcon'
import { Loader } from '@sushiswap/ui13/components/Loader'
import { FC, ReactNode, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useAccount, useContractWrite, usePrepareContractWrite, UserRejectedRequestError } from 'wagmi'
import { routeProcessorAbi } from '@sushiswap/abi'
import { useTrade } from '../lib/useTrade'
import { BigNumber } from 'ethers'
import { SendTransactionResult } from 'wagmi/actions'
import { useBalances, useCarbonOffset, useCreateNotification } from '@sushiswap/react-query'
import { createToast, NotificationData } from '@sushiswap/ui13/components/toast'
import { AppType } from '@sushiswap/ui13/types'
import { Native } from '@sushiswap/currency'
import { getRouteProcessorAddressForChainId } from 'lib/getRouteProcessorAddressForChainId'
import { ChainId } from '@sushiswap/chain'

interface ConfirmationDialogProps {
  children({
    onClick,
    isWritePending,
  }: {
    onClick(): void
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
  const { data: trade } = useTrade()
  const { refetch: refetchNetwork0Balances } = useBalances({ account: address, chainId: network0 })
  const { refetch: refetchNetwork1Balances } = useBalances({ account: address, chainId: network0 })
  const { mutate: storeNotification } = useCreateNotification({ account: address })
  const { data: carbonOffset } = useCarbonOffset()

  const [open, setOpen] = useState(false)
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)

  const { config } = usePrepareContractWrite({
    chainId: network0,
    address: getRouteProcessorAddressForChainId(network0),
    abi: routeProcessorAbi,
    functionName: carbonOffset && network0 === ChainId.POLYGON ? 'transferValueAndprocessRoute' : 'processRoute',
    args: trade?.writeArgs,
    enabled: Boolean(trade?.writeArgs) && appType === AppType.Swap,
    overrides: token0.isNative && trade?.writeArgs?.[1] ? { value: BigNumber.from(trade?.writeArgs?.[1]) } : undefined,
  })

  const isWrap =
    appType === AppType.Swap && token0.isNative && token1.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1.isNative && token0.wrapped.address === Native.onChain(network0).wrapped.address

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

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      setReview(false)

      data
        .wait()
        .then(() => setDialogState(ConfirmationDialogState.Success))
        .catch(() => setDialogState(ConfirmationDialogState.Failed))
        .finally(() => {
          if (appType === AppType.Swap) void refetchNetwork0Balances()
          if (appType === AppType.xSwap) void Promise.all([refetchNetwork0Balances(), refetchNetwork1Balances()])
        })
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
        isConfirming: dialogState === ConfirmationDialogState.Pending,
      })}
      <Dialog open={open} unmount={false} onClose={() => setOpen(false)}>
        <Dialog.Content>
          <div className="flex flex-col gap-5 items-center justify-center">
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
                <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                  Please sign order with your wallet.
                </h1>
              ) : dialogState === ConfirmationDialogState.Pending ? (
                <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
                  Waiting for your{' '}
                  <span className="text-blue hover:underline cursor-pointer">
                    <Dots>transaction</Dots>
                  </span>{' '}
                  to be confirmed on the blockchain.
                </h1>
              ) : dialogState === ConfirmationDialogState.Success ? (
                <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                  You {isWrap ? 'wrapped' : isUnwrap ? 'unwrapped' : 'sold'}
                  <span className="text-red px-0.5">
                    {trade?.amountIn?.toSignificant(6)} {token0.symbol}
                  </span>{' '}
                  {isWrap ? 'to' : isUnwrap ? 'to' : 'for'}{' '}
                  <span className="text-blue px-0.5">
                    {trade?.amountOut?.toSignificant(6)} {token1.symbol}.
                  </span>
                </h1>
              ) : (
                <h1 className="flex flex-wrap justify-center gap-1 font-semibold text-lg items-center">
                  <span className="text-red">Oops!</span> Your{' '}
                  <span className="text-blue hover:underline cursor-pointer">transaction</span> failed
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
