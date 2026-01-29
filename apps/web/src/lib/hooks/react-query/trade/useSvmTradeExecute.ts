import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Amount, Percent, Price, ZERO, subtractSlippage } from 'sushi'
import { isSvmChainId } from 'sushi/svm'
import { stringify } from 'viem'
import { svmExecuteValidator } from './svmUltraValidator'
import type { UseSvmTradeExecuteQuerySelect, UseSvmTradeParams } from './types'

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
  const { fromToken, toToken, order } = variables

  const select: UseSvmTradeExecuteQuerySelect = useCallback(
    (data) => {
      if (!order || !fromToken || !toToken) {
        return {
          swapPrice: undefined,
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          minAmountOut: undefined,
          gasSpent: undefined,
          gasSpentUsd: undefined,
          fee: undefined,
          route: undefined,
          status: undefined,
          tx: undefined,
          tokenTax: undefined,
          routingSource: undefined,
        }
      }

      const amountIn = new Amount(fromToken, order.inAmount)
      const amountOut = new Amount(toToken, order.outAmount)
      const minAmountOut = new Amount(toToken, order.otherAmountThreshold)

      const swapPrice =
        amountOut && amountIn && amountOut.gt(ZERO)
          ? new Price({
              baseAmount: amountIn,
              quoteAmount: amountOut,
            })
          : undefined

      const priceImpact =
        order.priceImpact !== undefined && Number.isFinite(order.priceImpact)
          ? new Percent({
              numerator: -Math.round(order.priceImpact * 100),
              denominator: 10000,
            })
          : new Percent(0)

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
        status: 'Success',
        tx: data,
        tokenTax: undefined,
        routingSource: 'TODO',
      }
    },
    [fromToken, order, toToken],
  )

  return useSvmTradeExecuteQuery(variables, select)
}
