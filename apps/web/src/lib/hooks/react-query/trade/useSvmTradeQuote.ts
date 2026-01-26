import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Amount, Percent, Price, ZERO } from 'sushi'
import { SvmNative, isSvmChainId } from 'sushi/svm'
import { stringify } from 'viem'
import { svmOrderValidator } from './svmUltraValidator'
import type { UseSvmTradeParams, UseSvmTradeQuoteQuerySelect } from './types'

// TODO !: Fix acc
// const ULTRA_REFERRAL_ACCOUNT = '11111111111111111111111111111111'
const ULTRA_REFERRAL_FEE_BPS = 50
const LAMPORTS_PER_SOL = 1_000_000_000
const SOL_PRICE_USD = 150

export const useSvmTradeQuoteQuery = (
  params: UseSvmTradeParams | undefined,
  select: UseSvmTradeQuoteQuerySelect,
) => {
  const { chainId, fromToken, toToken, amount, recipient, enabled } =
    params || {}

  return useQuery({
    queryKey: [
      'getSvmTradeQuote',
      {
        chainId,
        fromToken,
        toToken,
        amount,
        recipient,
      },
    ],
    queryFn: async () => {
      if (!chainId || !isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      if (!fromToken || !toToken || !amount) {
        throw new Error('Missing required parameters for SVM trade quote')
      }

      const params = new URLSearchParams()
      params.set('inputMint', fromToken.wrap().address)
      params.set('outputMint', toToken.wrap().address)
      params.set('amount', amount.amount.toString())

      // params.set('referralAccount', ULTRA_REFERRAL_ACCOUNT)
      // params.set('referralFee', ULTRA_REFERRAL_FEE_BPS.toString())

      // TODO: Add taker once we have full Solana wallet support
      if (recipient) {
        params.set('taker', recipient)
      }

      params.set('taker', '8N2ssXZGJbvVLszanERuCJpLZd2nuADgpZwLkDDxwNnS')

      const res = await fetch(`/api/jupiter/ultra/order?${params.toString()}`, {
        method: 'GET',
      })

      if (!res.ok) {
        throw new Error(`Jupiter order failed: ${res.statusText}`)
      }

      const json = await res.json()
      return svmOrderValidator.parse(json)
    },
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    gcTime: 0,
    retry: false,
    select,
    enabled: Boolean(
      enabled &&
        params &&
        isSvmChainId(params.chainId) &&
        fromToken &&
        toToken &&
        amount,
    ),
    queryKeyHashFn: stringify,
  })
}

export const useSvmTradeQuote = (variables: UseSvmTradeParams | undefined) => {
  const { fromToken, toToken } = variables || {}

  const select: UseSvmTradeQuoteQuerySelect = useCallback(
    (order) => {
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
          tx: undefined,
          tokenTax: undefined,
          routingSource: undefined,
        }
      }

      const amountIn = new Amount(fromToken, order.inAmount)
      const amountOut = new Amount(toToken, order.outAmount)
      const minAmountOut = new Amount(toToken, order.otherAmountThreshold)

      const priceImpact =
        order.priceImpact !== undefined && Number.isFinite(order.priceImpact)
          ? new Percent({
              numerator: -Math.round(order.priceImpact * 100),
              denominator: 10000,
            })
          : new Percent(0)

      const swapPrice =
        amountOut.gt(ZERO) && amountIn
          ? new Price({
              baseAmount: amountIn,
              quoteAmount: amountOut,
            })
          : undefined

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
        lamports > 0 ? (lamports / LAMPORTS_PER_SOL) * SOL_PRICE_USD : undefined

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
        tx: undefined,
        tokenTax: undefined,
        routingSource: order.router,
      }
    },
    [fromToken, toToken],
  )

  return useSvmTradeQuoteQuery(variables, select)
}
