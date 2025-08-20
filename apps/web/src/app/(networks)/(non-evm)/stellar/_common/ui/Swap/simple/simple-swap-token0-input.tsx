import React, { useEffect, useTransition } from 'react'
import { useSwap } from '~stellar/_common/lib/hooks/use-swap'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'
import { useStellarWallet } from '~stellar/providers'

export const SimpleSwapToken0Input = () => {
  const [, startTransition] = useTransition()
  const { isConnected } = useStellarWallet()
  const { amount, token0 } = useSimpleSwapState()
  const {
    setAmount,
    setToken0,
    setOutputAmount,
    setSlippageAmount,
    setPriceFetching,
    setError,
    // setBestRoutes,
    // setNoRouteFound,
  } = useSimpleSwapActions()
  const {
    mutateAsync: swapTokens,
    isPending: isSwapPending,
    isSuccess: isSwapSuccess,
    data: swapAmounts,
    isError: isSwapError,
    error: swapError,
  } = useSwap({
    zeroForOne: true,
  })

  useEffect(() => {
    // TODO: allow to check swap amount without being connected
    if (!isConnected) return
    startTransition(async () => {
      setOutputAmount(0n)
      setSlippageAmount(0)
      // setNoRouteFound('')
      if (Number(amount) > 0) {
        const result = await swapTokens()
        console.log('swap result', result)
        // if (route?.route) {
        //   setBestRoutes(route?.route)
        //   setNoRouteFound('')
        // } else if (!isPriceFetching) {
        //   setBestRoutes([])
        //   setNoRouteFound('No trade found')
        // }
      }
    })
  }, [amount, swapTokens, isConnected, setOutputAmount, setSlippageAmount])

  useEffect(() => {
    if (isSwapPending) {
      setPriceFetching(true)
    } else {
      setPriceFetching(false)
    }
  }, [isSwapPending, setPriceFetching])

  useEffect(() => {
    if (isSwapError) {
      setError(swapError.message)
    } else {
      setError('')
    }
  }, [isSwapError, swapError, setError])

  useEffect(() => {
    if (isSwapSuccess) {
      setOutputAmount(BigInt(Math.abs(Number(swapAmounts.amountOut))))
      setSlippageAmount(Math.abs(Number(swapAmounts.amountOut)))
    }
  }, [isSwapSuccess, swapAmounts, setOutputAmount, setSlippageAmount])

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
