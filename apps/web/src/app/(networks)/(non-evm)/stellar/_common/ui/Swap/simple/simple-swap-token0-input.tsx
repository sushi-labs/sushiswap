import React, { useEffect, useMemo } from 'react'
import { useBestRoute } from '~stellar/swap/lib/hooks'

import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken0Input = () => {
  const { amount, token0, token1 } = useSimpleSwapState()
  const {
    setAmount,
    setToken0,
    setOutputAmount,
    setSlippageAmount,
    setPriceFetching,
    setPriceImpact,
    setError,
  } = useSimpleSwapActions()

  // Parse amount to bigint
  const amountIn = useMemo(() => {
    if (!amount || Number(amount) <= 0) return 0n
    try {
      const [integer = '0', fraction = ''] = amount.split('.')
      const normalizedFraction = fraction
        .padEnd(token0.decimals, '0')
        .slice(0, token0.decimals)
      const digits =
        `${integer}${normalizedFraction}`.replace(/^0+(?=\d)/, '') || '0'
      return BigInt(digits)
    } catch {
      return 0n
    }
  }, [amount, token0.decimals])

  const {
    route,
    isLoading: isRouteLoading,
    isFetching: isRouteFetching,
    isError: isQuoteError,
    error: quoteError,
  } = useBestRoute({
    tokenIn: token0,
    tokenOut: token1,
    amountIn,
    enabled: amountIn > 0n,
  })

  // Update fetching state - use isFetching to show loading for on-chain quotes
  useEffect(() => {
    setPriceFetching(isRouteLoading || isRouteFetching)
  }, [isRouteLoading, isRouteFetching, setPriceFetching])

  // Handle errors
  useEffect(() => {
    if (isQuoteError) {
      setError(quoteError?.message || 'Failed to get quote')
      setOutputAmount(0n)
      setSlippageAmount(0)
      setPriceImpact(null)
    } else {
      setError('')
    }
  }, [
    isQuoteError,
    quoteError,
    setError,
    setOutputAmount,
    setSlippageAmount,
    setPriceImpact,
  ])

  // Update output amount and price impact from route
  useEffect(() => {
    if (route && amountIn > 0n) {
      const amountOut = route.amountOut || 0n
      setOutputAmount(amountOut)

      // Note: slippageAmount is no longer used for amountOutMinimum calculation
      // It's kept for display purposes in simple-swap-trade-stats
      // We store the raw amountOut as a number for display
      if (amountOut <= BigInt(Number.MAX_SAFE_INTEGER)) {
        setSlippageAmount(Number(amountOut))
      } else {
        setSlippageAmount(0)
      }

      // Set the price impact from the route
      setPriceImpact(route.priceImpact ?? null)
    } else if (amountIn === 0n) {
      setOutputAmount(0n)
      setSlippageAmount(0)
      setPriceImpact(null)
    }
  }, [route, amountIn, setOutputAmount, setSlippageAmount, setPriceImpact])

  return (
    <CurrencyInput
      id="swap-from"
      type="INPUT"
      onSelect={setToken0}
      token={token0}
      value={String(amount)}
      onChange={setAmount}
      className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
      label="Sell"
    />
  )
}
