import React, { useEffect } from 'react'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/swap/simple/simple-swap-provider/simple-swap-provider'
import { useBestRoute } from '~stellar/swap/lib/hooks'

export const SimpleSwapToken0Input = () => {
  const { amount, amountIn, token0, token1 } = useSimpleSwapState()
  const {
    setAmount,
    setToken0,
    setOutputAmount,
    setSlippageAmount,
    setPriceFetching,
    setPriceImpact,
    setError,
  } = useSimpleSwapActions()

  const {
    route,
    isFetching: isRouteFetching,
    isError: isQuoteError,
    error: quoteError,
  } = useBestRoute({
    tokenIn: token0,
    tokenOut: token1,
    amountIn,
  })

  // Update fetching state - use isFetching to show loading for on-chain quotes
  useEffect(() => {
    setPriceFetching(isRouteFetching)
  }, [isRouteFetching, setPriceFetching])

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
      chainId={token0?.chainId}
      id="swap-from"
      type="INPUT"
      onSelect={setToken0}
      currency={token0}
      value={String(amount)}
      onChange={setAmount}
      className="p-3 bg-white border border-accent dark:bg-slate-800 rounded-xl"
      label="Sell"
    />
  )
}
