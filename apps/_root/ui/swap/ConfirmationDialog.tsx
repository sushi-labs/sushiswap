'use client'

import { FC, ReactNode, useCallback, useState } from 'react'

import { useSwapActions, useSwapState } from './trade/TradeProvider'
import { useAccount, useContractWrite, usePrepareContractWrite, UserRejectedRequestError } from '@sushiswap/wagmi'
import { useTrade } from '../../lib/swap/useTrade'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'
import { createErrorToast, createToast } from '@sushiswap/ui/future/components/toast'
import { AppType } from '@sushiswap/ui/types'
import { Native } from '@sushiswap/currency'
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
import { Bridge, LiquidityProviders } from '@sushiswap/router'
import { Chain } from '@sushiswap/chain'
import { useNetwork } from 'wagmi'

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
  const { chain } = useNetwork()
  const { setReview } = useSwapActions()
  const { appType, network0, token0, token1, review } = useSwapState()
  const { approved } = useApproved('swap')
  const { data: trade } = useTrade({ crossChain: false })

  if (trade?.route && trade?.route?.status !== 'NoWay') {
    if (
      trade?.route?.legs?.every(
        (leg) =>
          leg.poolName.startsWith('Wrap') ||
          leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
          leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
          leg.poolName.startsWith(LiquidityProviders.Trident) ||
          leg.poolName.startsWith(Bridge.BentoBox)
      )
    ) {
      console.log('Swap success (internal)', {
        route: trade?.route,
      })
    } else if (
      trade?.route?.legs?.some(
        (leg) =>
          !leg.poolName.startsWith('Wrap') &&
          (leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
            leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
            leg.poolName.startsWith(LiquidityProviders.Trident) ||
            leg.poolName.startsWith(Bridge.BentoBox))
      ) &&
      trade?.route?.legs?.some(
        (leg) =>
          !leg.poolName.startsWith('Wrap') &&
          (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
            !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
            !leg.poolName.startsWith(LiquidityProviders.Trident) ||
            !leg.poolName.startsWith(Bridge.BentoBox))
      )
    ) {
      console.log('Swap success (mix)', {
        route: trade?.route,
      })
    } else if (
      trade?.route?.legs?.every(
        (leg) =>
          leg.poolName.startsWith('Wrap') ||
          (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) &&
            !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) &&
            !leg.poolName.startsWith(LiquidityProviders.Trident) &&
            !leg.poolName.startsWith(Bridge.BentoBox))
      )
    ) {
      console.log('Swap success (external)', {
        route: trade?.route,
      })
    } else {
      console.log('Swap success (unknown)', {
        route: trade?.route,
      })
    }
  }

  const [slippageTolerance] = useSlippageTolerance()
  const refetchBalances = useBalanceWeb3Refetch()

  const [open, setOpen] = useState(false)
  const [dialogState, setDialogState] = useState<ConfirmationDialogState>(ConfirmationDialogState.Undefined)

  console.log(
    Boolean(trade?.writeArgs) &&
      appType === AppType.Swap &&
      (isRouteProcessorChainId(network0) || isRouteProcessor3ChainId(network0)) &&
      approved &&
      trade?.route?.status !== 'NoWay',
    [
      trade,
      Boolean(trade?.writeArgs),
      appType === AppType.Swap,
      isRouteProcessorChainId(network0) || isRouteProcessor3ChainId(network0),
      approved,
      trade?.route?.status !== 'NoWay',
    ]
  )

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
      Boolean(trade?.writeArgs &&
      appType === AppType.Swap &&
      (isRouteProcessorChainId(network0) || isRouteProcessor3ChainId(network0)) &&
      approved &&
      trade?.route?.status !== 'NoWay' && chain?.id === network0),
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
          failed: `Something went wrong when trying to ${isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'} ${
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
          log.info('swap receipt', {
            receipt,
          })
          if (receipt.status === 1) {
            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                  leg.poolName.startsWith(LiquidityProviders.Trident) ||
                  leg.poolName.startsWith(Bridge.BentoBox)
              )
            ) {
              log.info('internal route', {
                chainId: network0,
                txHash: data.hash,
                exporerLink: Chain.txUrl(network0, data.hash),
                trade,
              })
            } else if (
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    leg.poolName.startsWith(Bridge.BentoBox))
              ) &&
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    !leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.info('mix route', {
                chainId: network0,
                txHash: data.hash,
                exporerLink: Chain.txUrl(network0, data.hash),
                trade,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) &&
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) &&
                    !leg.poolName.startsWith(LiquidityProviders.Trident) &&
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.info('external route', {
                chainId: network0,
                txHash: data.hash,
                exporerLink: Chain.txUrl(network0, data.hash),
                trade,
              })
            } else {
              log.info('Swap success (unknown)', {
                chainId: network0,
                txHash: data.hash,
                exporerLink: Chain.txUrl(network0, data.hash),
                trade,
              })
            }
            setDialogState(ConfirmationDialogState.Success)
          } else {
            if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                  leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                  leg.poolName.startsWith(LiquidityProviders.Trident) ||
                  leg.poolName.startsWith(Bridge.BentoBox)
              )
            ) {
              log.error('internal route', {
                chainId: network0,
                txHash: data.hash,
                // exporerLink: Chain.txUrl(network0, data.hash),
                route: trade?.route,
                // data,
                // receipt,
              })
            } else if (
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    leg.poolName.startsWith(Bridge.BentoBox))
              ) &&
              trade?.route?.legs?.some(
                (leg) =>
                  !leg.poolName.startsWith('Wrap') &&
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) ||
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) ||
                    !leg.poolName.startsWith(LiquidityProviders.Trident) ||
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.error('mix route', {
                chainId: network0,
                txHash: data.hash,
                // exporerLink: Chain.txUrl(network0, data.hash),
                route: trade?.route,
                // data,
                // receipt,
              })
            } else if (
              trade?.route?.legs?.every(
                (leg) =>
                  leg.poolName.startsWith('Wrap') ||
                  (!leg.poolName.startsWith(LiquidityProviders.SushiSwapV2) &&
                    !leg.poolName.startsWith(LiquidityProviders.SushiSwapV3) &&
                    !leg.poolName.startsWith(LiquidityProviders.Trident) &&
                    !leg.poolName.startsWith(Bridge.BentoBox))
              )
            ) {
              log.error('external route', {
                chainId: network0,
                txHash: data.hash,
                // exporerLink: Chain.txUrl(network0, data.hash),
                route: trade?.route,
                // data,
                // receipt,
              })
            } else {
              log.error('Swap failed (unknown)', {
                chainId: network0,
                txHash: data.hash,
                // exporerLink: Chain.txUrl(network0, data.hash),
                route: trade?.route,
                // data,
                // receipt,
              })
            }
            setDialogState(ConfirmationDialogState.Failed)
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
      createErrorToast(error.message, false)
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
