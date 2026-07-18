'use client'

import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SupportedChainId } from 'src/config'
import { APPROVE_TAG_SWAP } from 'src/lib/constants'
import { sendDrilldownLog } from 'src/lib/drilldown-log'
import {
  EVM_TRADE_GAS_MARGIN_PERCENT,
  type UseEvmTradeReturn,
} from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { logger } from 'src/lib/logger'
import {
  fetchTransactionReceipt,
  refetchTransactionReceipt,
} from 'src/lib/transactions/transaction-receipt-query'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import {
  isTerminalReceiptObservationError,
  waitForSuccessfulReceipt,
} from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { Amount, getNativeAddress } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  addGasMargin,
  getEvmCurrencyAddress,
  isEvmChainId,
} from 'sushi/evm'
import { type SendTransactionReturnType, stringify } from 'viem'
import { useConnection, usePublicClient, useSendTransaction } from 'wagmi'
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

  return useEvmSimpleSwapTradeReviewForState(state)
}

function useEvmSimpleSwapTradeReviewForState({
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
  const queryClient = useQueryClient()

  const trace = useTrace()
  const { data: prices } = usePrices({ chainId })

  const tradeRef = useRef<UseEvmTradeReturn | null>(null)
  const currentHashRef = useRef<SendTransactionReturnType | null>(null)
  const [status, setStatus] = useState<
    'pending' | 'success' | 'error' | 'unknown'
  >('pending')

  const isWrap = isWrapTrade(token0, token1)
  const isUnwrap = isUnwrapTrade(token0, token1)

  useEffect(() => {
    if (!confirmDialogOpen) currentHashRef.current = null
  }, [confirmDialogOpen])

  const observeReceipt = useCallback(
    (hash: SendTransactionReturnType, submittedTrade: UseEvmTradeReturn) => {
      if (!chainId) return

      const receiptPromise = fetchTransactionReceipt({
        queryClient,
        chainId,
        hash,
        isTerminalError: isTerminalReceiptObservationError,
        queryFn: () => waitForSuccessfulReceipt(client, hash),
        onAttempt: () => {
          if (currentHashRef.current === hash) setStatus('pending')
        },
        onRetry: (error) => {
          if (currentHashRef.current === hash) setStatus('unknown')
          logger.error(error, {
            location: 'SimpleSwapTradeReviewDialog',
            action: 'observeReceipt',
            txHash: hash,
          })
        },
      })

      void receiptPromise.then(
        async (receipt) => {
          refetchBalances(chainId)

          if (currentHashRef.current === hash) {
            setStatus('success')
            setSwapAmount('')
            resetDetailsTrackedState()
          }

          sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_COMPLETED, {
            txHash: hash,
            from: receipt.from,
            chain_id: chainId,
            tx: stringify(submittedTrade.tx),
          })

          if (
            submittedTrade.amountIn?.currency &&
            submittedTrade.amountOut?.currency
          ) {
            const token0Usd =
              prices?.get(submittedTrade.amountIn.currency.wrap().address) ?? 0
            const swapAmountUsd = Amount.tryFromHuman(
              submittedTrade.amountIn.currency,
              submittedTrade.amountIn.toString(),
            )?.mulHuman(token0Usd)
            const swapDetails = {
              location: '_SimpleSwapTradeReviewDialog',
              action: 'onSwapSuccess',
              chainId: String(chainId),
              token0:
                submittedTrade.amountIn.currency.type === 'native'
                  ? 'native'
                  : submittedTrade.amountIn.currency.address,
              token0Symbol: submittedTrade.amountIn.currency.symbol ?? 'N/A',
              token1:
                submittedTrade.amountOut.currency.type === 'native'
                  ? 'native'
                  : submittedTrade.amountOut.currency.address,
              token1Symbol: submittedTrade.amountOut.currency.symbol ?? 'N/A',
              swapAmount: submittedTrade.amountIn.toString(),
              swapAmountUsd:
                swapAmountUsd && token0Usd ? swapAmountUsd.toString() : 'N/A',
              feeUsd: submittedTrade.fee
                ? submittedTrade.fee.replaceAll('$', '')
                : 'N/A',
              recipient: recipient ?? 'N/A',
              timestamp: Date.now().toString(),
              detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
              wasDetailsTouched: wasDetailsTouched ? 'yes' : 'no',
            }

            try {
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
            } catch (error) {
              logger.error(error, {
                location: 'SimpleSwapTradeReviewDialog',
                action: 'sendDrilldownLog',
                txHash: hash,
              })
            }
          }
        },
        (error: unknown) => {
          if (!isTerminalReceiptObservationError(error)) return

          if (currentHashRef.current === hash) setStatus('error')

          const nativeAddress = getNativeAddress(chainId)
          sendAnalyticsEvent(SwapEventName.SWAP_TRANSACTION_FAILED, {
            txHash: hash,
            chain_id: chainId,
            token_from:
              submittedTrade.amountIn?.currency.type === 'token'
                ? submittedTrade.amountIn.currency.address
                : nativeAddress,
            token_to:
              submittedTrade.amountOut?.currency.type === 'token'
                ? submittedTrade.amountOut.currency.address
                : nativeAddress,
            tx: stringify(submittedTrade.tx),
          })
          refetchBalances(chainId)
        },
      )

      return receiptPromise
    },
    [
      chainId,
      client,
      isDetailsCollapsed,
      prices,
      queryClient,
      recipient,
      refetchBalances,
      resetDetailsTrackedState,
      setSwapAmount,
      wasDetailsTouched,
    ],
  )

  const onSwapSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      const submittedTrade = tradeRef.current
      if (!submittedTrade || !chainId) return

      currentHashRef.current = hash
      const receiptPromise = observeReceipt(hash, submittedTrade)
      if (!receiptPromise) return
      const ts = Date.now()
      const nativeAddress = getNativeAddress(chainId)

      sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
        ...(trace as Record<string, unknown>),
        txHash: hash,
        chainId,
        token0:
          submittedTrade.amountIn?.currency?.type === 'token'
            ? submittedTrade.amountIn.currency.address
            : nativeAddress,
        token1:
          submittedTrade.amountOut?.currency?.type === 'token'
            ? submittedTrade.amountOut.currency.address
            : nativeAddress,
        amountIn: submittedTrade.amountIn?.amount,
        amountOut: submittedTrade.amountOut?.amount,
        amountOutMin: submittedTrade.minAmountOut?.amount,
      })

      void createToast({
        account: address,
        type: 'swap',
        chainId,
        txHash: hash,
        promise: receiptPromise,
        summary: {
          pending: `${
            isWrap ? 'Wrapping' : isUnwrap ? 'Unwrapping' : 'Swapping'
          } ${submittedTrade.amountIn?.toSignificant(6)} ${
            submittedTrade.amountIn?.currency.symbol
          } ${isWrap ? 'to' : isUnwrap ? 'to' : 'for'} ${submittedTrade.amountOut?.toSignificant(
            6,
          )} ${submittedTrade.amountOut?.currency.symbol}`,
          completed: `${isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : 'Swap'} ${submittedTrade.amountIn?.toSignificant(
            6,
          )} ${submittedTrade.amountIn?.currency.symbol} ${
            isWrap ? 'to' : isUnwrap ? 'to' : 'for'
          } ${submittedTrade.amountOut?.toSignificant(6)} ${
            submittedTrade.amountOut?.currency.symbol
          }`,
          failed: `Something went wrong when trying to ${
            isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'
          } ${submittedTrade.amountIn?.currency.symbol} ${
            isWrap ? 'to' : isUnwrap ? 'to' : 'for'
          } ${submittedTrade.amountOut?.currency.symbol}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [address, chainId, isUnwrap, isWrap, observeReceipt, trace],
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

  const retryReceipt = useCallback(() => {
    const hash = currentHashRef.current
    if (!hash || !chainId) return
    void refetchTransactionReceipt(queryClient, chainId, hash)
  }, [chainId, queryClient])

  const write = useMemo(() => {
    if (!trade?.tx || address?.toLowerCase() !== trade.tx.from.toLowerCase())
      return undefined

    const { to, gas, data, value } = trade.tx

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync({
          to,
          data,
          value,
          gas: gas
            ? addGasMargin(BigInt(gas), EVM_TRADE_GAS_MARGIN_PERCENT)
            : undefined,
        })
        confirm()
      } catch {}
    }
  }, [address, trade?.tx, sendTransactionAsync])

  return {
    trade,
    tradeRef: tradeRef,
    write,
    isWritePending,
    txHash,
    status,
    retryReceipt,
    slippagePercent,
    isSwapQueryFetching,
    isSwapQuerySuccess,
    isSwapQueryError,
    swapQueryError,
    isWrap,
    isUnwrap,
  }
}
