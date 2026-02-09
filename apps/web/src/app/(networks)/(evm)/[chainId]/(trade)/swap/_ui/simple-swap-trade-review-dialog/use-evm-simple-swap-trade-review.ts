'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useCallback, useMemo, useRef } from 'react'
import type { SupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP, NativeAddress } from 'src/lib/constants'
import { sendDrilldownLog } from 'src/lib/drilldown-log'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { logger } from 'src/lib/logger'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  addGasMargin,
  evmNativeAddress,
  getEvmCurrencyAddress,
  isEvmChainId,
} from 'sushi/evm'
import { type SendTransactionReturnType, stringify } from 'viem'
import {
  useConnection,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useDetailsInteractionTracker } from '../../../_ui/details-interaction-tracker-provider'
import { isUnwrapTrade, isWrapTrade } from '../common'
import {
  useDerivedStateSimpleSwap,
  useEvmSimpleSwapTrade,
} from '../derivedstate-simple-swap-provider'
import type { UseSimpleSwapTradeReviewBaseReturn } from './use-simple-swap-trade-review'

export function useEvmSimpleSwapTradeReview(): UseSimpleSwapTradeReviewBaseReturn {
  const { state: _state } = useDerivedStateSimpleSwap<
    EvmChainId & SupportedChainId
  >()

  const state = isEvmChainId(_state.chainId)
    ? _state
    : {
        chainId: undefined,
        recipient: undefined,
        token0: undefined,
        token1: undefined,
      }

  return _useEvmSimpleSwapTradeReview(state)
}

function _useEvmSimpleSwapTradeReview({
  chainId,
  recipient,
  token0,
  token1,
}: {
  chainId: (EvmChainId & SupportedChainId) | undefined
  recipient: EvmAddress | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
}): UseSimpleSwapTradeReviewBaseReturn {
  const {
    mutate: { setSwapAmount },
  } = useDerivedStateSimpleSwap<EvmChainId & SupportedChainId>()

  const {
    state: { isDetailsCollapsed, wasDetailsTouched },
    mutate: { resetDetailsTrackedState },
  } = useDetailsInteractionTracker()

  const { address } = useConnection()

  const client = usePublicClient({ chainId })

  const { approved } = useApproved(APPROVE_TAG_SWAP)
  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const [slippagePercent] = useSlippageTolerance()

  const enabled = Boolean(
    chainId && approved && address && (confirmDialogOpen || reviewDialogOpen),
  )

  const {
    data: trade,
    isFetching: isSwapQueryFetching,
    isSuccess: isSwapQuerySuccess,
    isError: isSwapQueryError,
    error: swapQueryError,
  } = useEvmSimpleSwapTrade(enabled)

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const trace = useTrace()
  const { data: prices } = usePrices({ chainId })

  const tradeRef = useRef<UseEvmTradeReturn | null>(null)

  const isWrap = isWrapTrade(token0, token1)
  const isUnwrap = isUnwrapTrade(token0, token1)

  const onSwapSuccess = useCallback(
    async (hash: SendTransactionReturnType) => {
      if (!trade || !chainId) return

      try {
        const ts = new Date().getTime()
        const promise = client.waitForTransactionReceipt({
          hash,
        })

        sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
          ...(trace as Record<string, unknown>),
          txHash: hash,
          chainId: chainId,
          token0:
            tradeRef?.current?.amountIn?.currency?.type === 'token'
              ? tradeRef?.current?.amountIn?.currency?.address
              : evmNativeAddress,
          token1:
            tradeRef?.current?.amountOut?.currency?.type === 'token'
              ? tradeRef?.current?.amountOut?.currency?.address
              : evmNativeAddress,
          amountIn: tradeRef?.current?.amountIn?.amount,
          amountOut: tradeRef?.current?.amountOut?.amount,
          amountOutMin: tradeRef?.current?.minAmountOut?.amount,
        })

        void createToast({
          account: address,
          type: 'swap',
          chainId: chainId,
          txHash: hash,
          promise,
          summary: {
            pending: `${
              isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'
            } ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            completed: `${
              isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'
            } ${trade.amountIn?.toSignificant(6)} ${
              trade.amountIn?.currency.symbol
            } ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.toSignificant(6)} ${
              trade.amountOut?.currency.symbol
            }`,
            failed: `Something went wrong when trying to ${
              isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'
            } ${trade.amountIn?.currency.symbol} ${
              isWrap ? 'to' : isUnwrap ? 'to' : 'for'
            } ${trade.amountOut?.currency.symbol}`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })

        const receipt = await promise
        {
          const trade = tradeRef.current
          if (receipt.status === 'success') {
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_COMPLETED, {
              txHash: hash,
              from: receipt.from,
              chain_id: chainId,
              tx: stringify(trade?.tx),
            })
            if (trade?.amountIn?.currency && trade?.amountOut?.currency) {
              const token0Usd =
                prices?.get(trade?.amountIn?.currency.wrap().address) ?? 0
              const swapAmountUsd = Amount.tryFromHuman(
                trade?.amountIn?.currency,
                trade?.amountIn?.toString(),
              )?.mulHuman(token0Usd)
              const swapDetails = {
                location: '_SimpleSwapTradeReviewDialog',
                action: 'onSwapSuccess',
                chainId: String(chainId),
                token0:
                  trade?.amountIn?.currency.type === 'native'
                    ? 'native'
                    : trade?.amountIn?.currency.address,
                token0Symbol: trade?.amountIn?.currency.symbol ?? 'N/A',
                token1:
                  trade?.amountOut?.currency.type === 'native'
                    ? 'native'
                    : trade?.amountOut?.currency.address,
                token1Symbol: trade?.amountOut?.currency.symbol ?? 'N/A',
                swapAmount: trade?.amountIn?.toString(),
                swapAmountUsd:
                  swapAmountUsd && token0Usd
                    ? swapAmountUsd?.toString()
                    : 'N/A',
                feeUsd: trade?.fee ? trade.fee?.replaceAll('$', '') : 'N/A',
                recipient: recipient ? recipient : 'N/A',
                timestamp: Date.now().toString(),
                detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
                wasDetailsTouched: wasDetailsTouched ? 'yes' : 'no',
              }
              await sendDrilldownLog({
                dataForLog: swapDetails,
                extraFields: {
                  detailsCollapsedState: swapDetails.detailsCollapsedState,
                  feeUsd: swapDetails.feeUsd,
                  chainId: swapDetails.chainId,
                  wasDetailsTouched: swapDetails.wasDetailsTouched,
                  recipient: swapDetails.recipient,
                },
                logLevel: 'info',
              })
            }
          } else {
            sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_FAILED, {
              txHash: hash,
              from: receipt.from,
              chain_id: chainId,
              token_from:
                trade?.amountIn?.currency.type === 'token'
                  ? trade?.amountIn?.currency.address
                  : NativeAddress,
              token_to:
                trade?.amountOut?.currency.type === 'token'
                  ? trade?.amountOut?.currency.address
                  : NativeAddress,
              tx: stringify(trade?.tx),
            })
          }
        }
      } finally {
        setSwapAmount('')
        refetchBalances(chainId)
        resetDetailsTrackedState()
      }
    },
    [
      setSwapAmount,
      trade,
      chainId,
      client,
      address,
      isWrap,
      isUnwrap,
      refetchBalances,
      trace,
      prices,
      recipient,
      resetDetailsTrackedState,
      isDetailsCollapsed,
      wasDetailsTouched,
    ],
  )

  const onSwapError = useCallback(
    (e: Error) => {
      if (isUserRejectedError(e)) {
        return
      }

      const tokenFrom = trade?.amountIn?.currency
        ? getEvmCurrencyAddress(trade?.amountIn.currency)
        : 'unknown'
      const tokenTo = trade?.amountOut?.currency
        ? getEvmCurrencyAddress(trade?.amountOut.currency)
        : 'unknown'
      const tx = stringify(trade?.tx)

      logger.error(e, {
        location: 'SimpleSwapTradeReviewDialog',
        token_from: tokenFrom,
        token_to: tokenTo,
        tx,
      })
      sendAnalyticsEvent(SwapEventName.SWAP_ERROR, {
        token_from: tokenFrom,
        token_to: tokenTo,
        tx,
        error: e instanceof Error ? e.message : undefined,
      })
      createErrorToast(e.message, false)
    },
    [trade?.amountIn?.currency, trade?.amountOut?.currency, trade?.tx],
  )

  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: txHash,
  } = useSendTransaction({
    mutation: {
      onMutate: () => {
        // Set reference of current trade
        if (tradeRef && trade) {
          tradeRef.current = trade
        }
      },
      onSuccess: onSwapSuccess,
      onError: onSwapError,
    },
  })

  const write = useMemo(() => {
    if (!trade?.tx || address !== trade.tx.from) return undefined

    const { to, gas, data, value } = trade.tx

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync({
          to,
          data,
          value,
          gas: gas ? addGasMargin(BigInt(gas)) : undefined,
        })
        confirm()
      } catch {}
    }
  }, [address, trade?.tx, sendTransactionAsync])

  const { status } = useWaitForTransactionReceipt({
    chainId: chainId,
    hash: txHash,
  })

  return {
    trade,
    tradeRef: tradeRef,
    write,
    isWritePending,
    txHash,
    status,
    slippagePercent,
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    swapQueryError,
    isWrap,
    isUnwrap,
  }
}
