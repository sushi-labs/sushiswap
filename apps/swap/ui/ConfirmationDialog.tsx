'use client'

import { FC, ReactNode, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useAccount, useContractWrite, usePrepareContractWrite, UserRejectedRequestError } from '@sushiswap/wagmi'
import { useTrade } from '../lib/useTrade'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { createErrorToast, createToast } from '@sushiswap/ui/future/components/toast'
import { AppType } from '@sushiswap/ui/types'
import { Native } from '@sushiswap/currency'
import { swapErrorToUserReadableMessage } from '../lib/swapErrorToUserReadableMessage'
import { log } from 'next-axiom'
import { useApproved } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import {
  ConfirmationDialog as UIConfirmationDialog,
  ConfirmationDialogState,
} from '@sushiswap/ui/dialog/ConfirmationDialog'
import { useSlippageTolerance } from '@sushiswap/hooks'
import {
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
  routeProcessor3Address,
  routeProcessorAddress,
} from '@sushiswap/route-processor'
import { routeProcessor2Abi } from '@sushiswap/abi'
import { useBalanceWeb3Refetch } from '@sushiswap/wagmi/future/hooks'

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

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ children }) => {
  const { address } = useAccount()
  const { setReview } = useSwapActions()
  const { appType, network0, token0, token1, review } = useSwapState()
  const { approved } = useApproved('swap')
  const { data: trade } = useTrade({ crossChain: false })
  const [slippageTolerance] = useSlippageTolerance()
  const refetchBalances = useBalanceWeb3Refetch()

  const [open, setOpen] = useState(false)
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)

  const { config, isError, error } = usePrepareContractWrite({
    chainId: network0,
    address: isRouteProcessor3ChainId(network0)
      ? routeProcessor3Address[network0]
      : isRouteProcessorChainId(network0)
      ? routeProcessorAddress[network0]
      : undefined,
    abi: routeProcessor2Abi,
    functionName: trade?.functionName,
    args: trade?.writeArgs,
    enabled:
      Boolean(trade?.writeArgs) &&
      appType === AppType.Swap &&
      isRouteProcessorChainId(network0) &&
      approved &&
      trade?.route?.status !== 'NoWay',
    overrides: trade?.overrides,
    onError: (error) => {
      const message = error.message.toLowerCase()
      if (message.includes('user rejected') || message.includes('user cancelled')) {
        return
      }

      log.error('Swap prepare error', {
        trade,
        slippageTolerance,
        error,
      })
    },
  })

  const isWrap =
    appType === AppType.Swap && token0?.isNative && token1?.wrapped.address === Native.onChain(network0).wrapped.address
  const isUnwrap =
    appType === AppType.Swap && token1?.isNative && token0?.wrapped.address === Native.onChain(network0).wrapped.address

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!trade || !network0 || !data) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
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
      })
    },
    [trade, network0, address, isWrap, isUnwrap]
  )

  const {
    writeAsync,
    isLoading: isWritePending,
    data,
  } = useContractWrite({
    ...config,
    ...(config.request && { request: { ...config.request, gasLimit: config.request.gasLimit.mul(120).div(100) } }),
    onSuccess: async (data) => {
      setReview(false)
      data
        .wait()
        .then((receipt) => {
          if (receipt.status === 1) {
            setDialogState(ConfirmationDialogState.Success)

            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith('SushiSwap') ||
                  leg.poolName.startsWith('Trident') ||
                  leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap success (internal)', {
                trade,
                data,
                receipt,
              })
            } else if (
              !trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith('SushiSwap') ||
                  leg.poolName.startsWith('Trident') ||
                  leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap success (mix)', {
                trade,
                data,
                receipt,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  !leg.poolName.startsWith('SushiSwap') &&
                  !leg.poolName.startsWith('Trident') &&
                  !leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap success (external)', {
                trade,
                data,
                receipt,
              })
            } else {
              log.info('Swap success (unknown)', {
                trade,
                data,
                receipt,
              })
            }
          } else {
            setDialogState(ConfirmationDialogState.Failed)
            // Log swap success internal, mixed, or external
            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith('SushiSwap') ||
                  leg.poolName.startsWith('Trident') ||
                  leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap failed (internal)', {
                trade,
                data,
                receipt,
              })
            } else if (
              !trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith('SushiSwap') ||
                  leg.poolName.startsWith('Trident') ||
                  leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap failed (mix)', {
                trade,
                data,
                receipt,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  !leg.poolName.startsWith('SushiSwap') &&
                  !leg.poolName.startsWith('Trident') &&
                  !leg.poolName.startsWith('BentoBridge')
              )
            ) {
              log.info('Swap failed (external)', {
                trade,
                data,
                receipt,
              })
            } else {
              log.info('Swap failed (unknown)', {
                trade,
                data,
                receipt,
              })
            }
          }
        })
        .finally(async () => {
          await refetchBalances()
        })
    },
    onSettled,
    onError: (error) => {
      if (error.message.startsWith('user rejected transaction')) return
      log.error('Swap error', {
        trade,
        error,
      })
      createErrorToast(swapErrorToUserReadableMessage(error), false)
    },
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
      <UIConfirmationDialog
        chainId={network0}
        txHash={data?.hash}
        open={open}
        setOpen={() => setOpen(false)}
        state={dialogState}
        isWritePending={isWritePending}
        onComplete={onComplete}
        testId="make-another-swap"
        successMessage={
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
        }
        buttonSuccessMessage="Make another swap"
      />
    </>
  )
}
