import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { Amount, Percent, Price, ZERO } from 'sushi'
import { SvmNative, WSOL_ADDRESS, isSvmChainId } from 'sushi/svm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { svmExecuteValidator } from './svmUltraValidator'
import type { UseSvmTradeExecuteQuerySelect, UseSvmTradeParams } from './types'

const ULTRA_REFERRAL_FEE_BPS = 50
const LAMPORTS_PER_SOL = 1_000_000_000

export const useSvmTradeExecute = (variables: UseSvmTradeParams) => {
  const { fromToken, toToken, order, chainId, requestId, signedTransaction } =
    variables
  const resolvedRequestId = requestId ?? order?.requestId

  const { data: nativePrice } = usePrice({
    chainId,
    address: chainId ? WSOL_ADDRESS[chainId] : undefined,
  })

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

      const feeAmount = amountOut.mul(
        new Percent({ numerator: ULTRA_REFERRAL_FEE_BPS, denominator: 10000 }),
      )
      const feeUsd =
        order.outUsdValue !== undefined
          ? order.outUsdValue * (ULTRA_REFERRAL_FEE_BPS / 10000)
          : undefined

      const lamports =
        order.signatureFeeLamports +
        order.prioritizationFeeLamports +
        order.rentFeeLamports
      const gasAmount =
        lamports > 0
          ? new Amount(
              SvmNative.fromChainId(fromToken.chainId),
              Math.round(lamports).toString(),
            )
          : undefined
      const gasSpent = gasAmount?.toSignificant(4)
      const gasSpentUsd =
        nativePrice !== undefined && lamports > 0
          ? (lamports / LAMPORTS_PER_SOL) * nativePrice
          : undefined

      return {
        swapPrice,
        priceImpact,
        amountIn,
        amountOut,
        minAmountOut,
        gasSpent,
        gasSpentUsd:
          gasSpentUsd !== undefined ? gasSpentUsd.toFixed(4) : undefined,
        fee:
          feeUsd !== undefined
            ? `$${feeUsd.toFixed(4)}`
            : `${feeAmount.toSignificant(4)} ${toToken.symbol}`,
        route: order,
        status: data.status,
        tx: data,
        tokenTax: undefined,
        routingSource: order.router,
      }
    },
    [fromToken, order, toToken, nativePrice],
  )

  const mutation = useMutation({
    mutationKey: [
      'executeSvmTrade',
      {
        chainId,
        requestId: resolvedRequestId,
      },
    ],
    mutationFn: async (params?: {
      requestId?: string
      signedTransaction?: string
    }) => {
      if (!isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      const resolvedRequestId =
        params?.requestId ?? requestId ?? order?.requestId
      const resolvedSignedTransaction =
        params?.signedTransaction ?? signedTransaction

      if (!resolvedRequestId) {
        throw new Error('Missing requestId for SVM trade execute')
      }

      if (!resolvedSignedTransaction) {
        throw new Error('Missing signed transaction for SVM trade execute')
      }

      const body: Record<string, unknown> = {
        requestId: resolvedRequestId,
        signedTransaction: resolvedSignedTransaction,
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
    retry: false,
  })

  const data = useMemo(
    () => (mutation.data ? select(mutation.data) : undefined),
    [mutation.data, select],
  )

  return {
    ...mutation,
    data,
  }
}
