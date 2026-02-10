import { LAMPORTS_PER_SOL, useKitTransactionSigner } from '@solana/connector'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import {
  SVM_UI_FEE_BIPS,
  ULTRA_ADVANCED_FEE_INTEGRATOR_ID,
  ULTRA_ADVANCED_FEE_RECEIVER,
  ULTRA_FEE_MINT_OPTIONS,
} from 'src/config'
import { unwrapSol, wrapSol } from 'src/lib/svm/wrap-unwrap'
import { Amount, Percent, Price, ZERO } from 'sushi'
import {
  SvmChainId,
  SvmNative,
  WSOL,
  WSOL_ADDRESS,
  isSvmChainId,
} from 'sushi/svm'
import { stringify } from 'viem'
import {
  isWrapTrade,
  useWrapUnwrapTrade,
} from '~evm/[chainId]/(trade)/swap/_ui/common'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useAmountBalances } from '~evm/_common/ui/balance-provider/use-balances'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { svmOrderValidator } from './svmUltraValidator'
import type {
  UseSvmTradeParams,
  UseSvmTradeQuoteQuerySelect,
  UseSvmTradeReturn,
} from './types'

const FEE_MINTS = ULTRA_FEE_MINT_OPTIONS.map((i) =>
  i.shouldUseNativeForBalanceCheck
    ? SvmNative.fromChainId(SvmChainId.SOLANA)
    : i.currency,
)

function useTradeQuote(
  params: UseSvmTradeParams | undefined,
  isWrapUnwrap: boolean,
) {
  const { chainId, fromToken, toToken, amount, recipient, enabled } =
    params || {}

  const { data: svmPrices } = usePrices({
    chainId,
  })

  const { data: feeMintBalances } = useAmountBalances(
    chainId ? chainId : undefined,
    chainId && FEE_MINTS ? FEE_MINTS : undefined,
  )

  const nativePrice = useMemo(() => {
    if (chainId) {
      return svmPrices?.get(WSOL_ADDRESS[chainId])
    }
    return undefined
  }, [svmPrices, chainId])

  const fromTokenPrice = useMemo(() => {
    if (fromToken && chainId) {
      return svmPrices?.get(fromToken.wrap().address)
    }
    return undefined
  }, [svmPrices, chainId, fromToken])

  const feeOptions = useMemo(() => {
    return ULTRA_FEE_MINT_OPTIONS?.map((i) => ({
      ...i,
      priceUsd: svmPrices?.get(i.currency.wrap().address),
      balance: i.shouldUseNativeForBalanceCheck
        ? feeMintBalances?.get(SvmNative.fromChainId(i.currency.chainId).id)
        : feeMintBalances?.get(i.currency.id),
      fromTokenForCompare: i.shouldUseNativeForBalanceCheck
        ? fromToken?.wrap()
        : fromToken,
    }))
  }, [feeMintBalances, svmPrices, fromToken])

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
          status: undefined,
          tx: undefined,
          tokenTax: undefined,
          routingSource: undefined,
          type: undefined,
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
        new Percent({ numerator: SVM_UI_FEE_BIPS, denominator: 10000 }),
      )
      const feeUsd =
        order.outUsdValue !== undefined
          ? order.outUsdValue * (SVM_UI_FEE_BIPS / 10000)
          : undefined

      const lamports =
        order.signatureFeeLamports + order.prioritizationFeeLamports
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
        gasSpentUsd: gasSpentUsd?.toFixed(4),
        fee:
          feeUsd !== undefined
            ? `$${feeUsd.toFixed(4)}`
            : `${feeAmount.toSignificant(4)} ${toToken.symbol}`,
        route: { status: 'Success', ...order },
        status: order.errorCode ? 'Failed' : 'Success',
        tx: undefined,
        tokenTax: undefined,
        routingSource: order.router,
        type: 'swap',
      }
    },
    [fromToken, toToken, nativePrice],
  )

  return useQuery({
    queryKey: [
      'getSvmTradeQuote',
      {
        chainId,
        fromToken,
        toToken,
        amount,
        recipient,
        fromTokenPrice,
        feeOptions,
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

      if (recipient) {
        params.set('taker', recipient)
      }
      const initRes = await fetch(
        `/api/jupiter/ultra/order?${params.toString()}`,
        {
          method: 'GET',
        },
      )

      if (!initRes.ok) {
        throw new Error(`Jupiter order failed: ${initRes.statusText}`)
      }

      const initJson = await initRes.json()

      const outUsdValue = svmOrderValidator.parse(initJson)?.outUsdValue ?? 0
      const feeUsd = outUsdValue * (SVM_UI_FEE_BIPS / 10000)

      const payableFeeMintOptions = feeOptions
        ?.map((c) => {
          const price = c.priceUsd ?? 0
          const humanFee = price > 0 ? feeUsd / price : 0

          const feeAmount =
            humanFee > 0 ? Amount.tryFromHuman(c.currency, humanFee) : null

          const canPay = !!feeAmount && !!c.balance?.gte(feeAmount)

          return { ...c, feeAmount, canPay }
        })
        .filter((c) => c.canPay)

      if (payableFeeMintOptions?.length > 0) {
        params.set('feeReceiver', ULTRA_ADVANCED_FEE_RECEIVER)
        params.set('integratorId', ULTRA_ADVANCED_FEE_INTEGRATOR_ID)
        params.set('feeBps', SVM_UI_FEE_BIPS.toString())

        const sorted = payableFeeMintOptions.sort((a, b) => {
          if (!a.fromTokenForCompare || !b.fromTokenForCompare) {
            throw new Error('fromToken not defined')
          }
          const aSame = a.currency.isSame(a.fromTokenForCompare)
          const bSame = b.currency.isSame(b.fromTokenForCompare)
          if (aSame !== bSame) return aSame ? 1 : -1

          return (b.priority ?? 0) - (a.priority ?? 0)
        })
        const chosen = sorted?.[0]
        if (!chosen.fromTokenForCompare) {
          throw new Error('No token to compare to')
        }
        params.set('feeMint', chosen.currency.address)

        const feeMintEqualsFrom = chosen.currency.isSame(
          chosen.fromTokenForCompare,
        )

        if (feeMintEqualsFrom) {
          const alternative = sorted?.[1]
          if (alternative) {
            params.set('feeMint', alternative.currency.address)
          } else if (chosen.feeAmount) {
            //if no alternative feeMint option lower swap amount so fee can be taken
            const newSwapAmount = amount.sub(chosen.feeAmount)
            params.set('amount', newSwapAmount.amount.toString())
          } else {
            throw new Error(
              'No alternative fee mint and no fee amount available',
            )
          }
        }
      }

      const orderRes = await fetch(
        `/api/jupiter/ultra/order?${params.toString()}`,
        {
          method: 'GET',
        },
      )

      if (!orderRes.ok) {
        throw new Error(`Jupiter order failed: ${orderRes.statusText}`)
      }

      const orderJson = await orderRes.json()

      return svmOrderValidator.parse(orderJson)
    },
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    gcTime: 0,
    retry: false,
    select,
    enabled: Boolean(
      enabled &&
        !isWrapUnwrap &&
        chainId &&
        isSvmChainId(chainId) &&
        fromToken &&
        toToken &&
        amount &&
        feeOptions?.length,
    ),
    queryKeyHashFn: stringify,
  })
}

function useWrapUnwrapQuote(
  params: UseSvmTradeParams | undefined,
  isWrapUnwrap: boolean,
) {
  const { chainId, fromToken, toToken, amount, recipient, enabled } =
    params || {}

  const { data: wsolBalance } = useAmountBalance(
    chainId ? WSOL[chainId] : undefined,
  )
  const { data: nativePrice } = usePrice({
    chainId,
    address: chainId ? WSOL_ADDRESS[chainId] : undefined,
  })

  const { signer } = useKitTransactionSigner()

  return useQuery<UseSvmTradeReturn>({
    queryKey: [
      'getSvmWrapUnwrapQuote',
      {
        chainId,
        fromToken,
        toToken,
        amount,
        recipient,
        wsolBalance,
        signer,
      },
    ],
    queryFn: async () => {
      if (!chainId || !isSvmChainId(chainId)) {
        throw new Error('Unsupported SVM chainId')
      }

      if (!fromToken || !toToken || !amount || !signer) {
        throw new Error('Missing required parameters for wrap/unwrap quote')
      }

      const price =
        amount.gt(ZERO) && amount
          ? new Price({
              baseAmount: amount,
              quoteAmount: amount,
            })
          : undefined

      const { transaction: tx, fee: feeLamports } = isWrapTrade(
        fromToken,
        toToken,
      )
        ? await wrapSol(signer, amount)
        : await unwrapSol(
            signer,
            amount,
            wsolBalance ? amount.eq(wsolBalance) : false,
          )

      const gasAmount =
        feeLamports > 0n
          ? new Amount(SvmNative.fromChainId(chainId), feeLamports)
          : undefined
      const gasSpent = gasAmount?.toSignificant(4)
      const gasSpentUsd =
        nativePrice !== undefined && feeLamports > 0n
          ? (Number(feeLamports) / LAMPORTS_PER_SOL) * nativePrice
          : undefined

      const feeAmount = new Amount(toToken, 0)

      return {
        amountIn: amount,
        amountOut: amount,
        fee: `${feeAmount.toSignificant(4)} ${toToken.symbol}`,
        gasSpent,
        gasSpentUsd: gasSpentUsd?.toFixed(4),
        minAmountOut: amount,
        priceImpact: new Percent(0),
        route: undefined,
        status: 'Success',
        swapPrice: price,
        tokenTax: undefined,
        tx,
        routingSource: 'Wrap/Unwrap',
        type: 'wrap/unwrap',
      }
    },
    enabled: Boolean(
      enabled &&
        isWrapUnwrap &&
        chainId &&
        isSvmChainId(chainId) &&
        fromToken &&
        toToken &&
        amount,
    ),
  })
}

export function useSvmTradeQuote(params: UseSvmTradeParams | undefined) {
  const { fromToken, toToken } = params || {}

  const { isWrapUnwrap } = useWrapUnwrapTrade(fromToken, toToken)

  const wrapUnwrap = useWrapUnwrapQuote(params, isWrapUnwrap)
  const trade = useTradeQuote(params, isWrapUnwrap)

  return isWrapUnwrap ? wrapUnwrap : trade
}
