import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Amount, Percent, Price, ZERO, subtractSlippage } from 'sushi'
import { isSvmChainId } from 'sushi/svm'
import { stringify } from 'viem'
import { svmExecuteValidator } from './svmUltraValidator'
import type { UseSvmTradeExecuteQuerySelect, UseSvmTradeParams } from './types'

const toSlippageDecimal = (slippagePercentage: string) => {
  const parsed = Number(slippagePercentage)
  if (!Number.isFinite(parsed) || parsed < 0) return undefined
  return parsed / 100
}

export const useSvmTradeExecuteQuery = (
  { chainId, enabled, requestId, order, signedTransaction }: UseSvmTradeParams,
  select: UseSvmTradeExecuteQuerySelect,
) => {
  const resolvedRequestId = requestId ?? order?.requestId

  return useQuery({
    queryKey: [
      'getSvmTradeExecute',
      {
        chainId,
        requestId: resolvedRequestId,
      },
    ],
    queryFn: async () => {
      if (!isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      if (!resolvedRequestId) {
        throw new Error('Missing requestId for SVM trade execute')
      }

      if (!signedTransaction) {
        throw new Error('Missing signed transaction for SVM trade execute')
      }

      const body: Record<string, unknown> = {
        requestId: resolvedRequestId,
        signedTransaction,
      }

      // TODO: include compute unit price / prioritization fee fields once supported.

      const res = await fetch(`/api/jupiter/ultra/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error(`Jupiter execute failed: ${res.statusText}`)
      }

      const json = await res.json()
      return svmExecuteValidator.parse(json)
    },
    refetchOnWindowFocus: true,
    refetchInterval: 2500,
    gcTime: 0,
    retry: false,
    select,
    enabled: Boolean(
      enabled &&
        isSvmChainId(chainId) &&
        resolvedRequestId &&
        signedTransaction,
    ),
    queryKeyHashFn: stringify,
  })
}

export const useSvmTradeExecute = (variables: UseSvmTradeParams) => {
  const { fromToken, toToken, amount, order, slippagePercentage } = variables

  const select: UseSvmTradeExecuteQuerySelect = useCallback(
    (data) => {
      const amountIn =
        order && fromToken ? new Amount(fromToken, order.inAmount) : amount
      const amountOut =
        order && toToken ? new Amount(toToken, order.outAmount) : undefined
      const slippage = toSlippageDecimal(slippagePercentage)
      const minAmountOut =
        order && toToken && order.otherAmountThreshold
          ? new Amount(toToken, order.otherAmountThreshold)
          : amountOut && slippage !== undefined
            ? subtractSlippage(amountOut, slippage)
            : undefined

      const swapPrice =
        amountOut && amountIn && amountOut.gt(ZERO)
          ? new Price({
              baseAmount: amountIn,
              quoteAmount: amountOut,
            })
          : undefined

      const priceImpactValue = order
        ? order.priceImpact !== undefined
          ? order.priceImpact
          : order.priceImpactPct !== undefined
            ? Number(order.priceImpactPct)
            : undefined
        : undefined

      const priceImpact =
        order &&
        priceImpactValue !== undefined &&
        Number.isFinite(priceImpactValue)
          ? new Percent({
              numerator: Math.round(priceImpactValue * 10000),
              denominator: 10000,
            })
          : order
            ? new Percent(0)
            : undefined

      return {
        swapPrice,
        priceImpact,
        amountIn,
        amountOut,
        minAmountOut,
        gasSpent: undefined,
        gasSpentUsd: undefined,
        fee: undefined,
        route: order,
        tx: data,
        tokenTax: undefined,
      }
    },
    [amount, fromToken, order, slippagePercentage, toToken],
  )

  return useSvmTradeExecuteQuery(variables, select)
}
