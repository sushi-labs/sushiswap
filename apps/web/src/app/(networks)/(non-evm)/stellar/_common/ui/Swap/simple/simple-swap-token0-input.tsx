import React, { useEffect, useTransition } from 'react'
import { useSwap } from '~stellar/_common/lib/hooks/use-swap'
import {
  useSimpleSwapActions,
  useSimpleSwapState,
} from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { CurrencyInput } from '~stellar/_common/ui/currency/currency-input/currency-input'

export const SimpleSwapToken0Input = () => {
  const [, _startTransition] = useTransition()

  const { amount, token0 } = useSimpleSwapState()

  const {
    setAmount,
    setToken0,
    // setOutputAmount,
    // setPriceFetching,
    // setSlippageAmount,
    // setBestRoutes,
    // setNoRouteFound,
  } = useSimpleSwapActions()

  // useEffect(() => {
  //   console.log('swapAmounts', swapAmounts)
  //   console.log('amount', amount)
  //   startTransition(() => {
  //     // setOutputAmount('')
  //     // setSlippageAmount(0)
  //     // setNoRouteFound('')
  //     // setPriceFetching(isPriceFetching)
  //     if (Number(amount) > 0 && swapAmounts) {
  //       if (swapAmounts.amountOut) {
  //         setOutputAmount(String(swapAmounts.amountOut))
  //         setSlippageAmount(Number(swapAmounts.amountOut))
  //       }
  //       // if (route?.route) {
  //       //   setBestRoutes(route?.route)
  //       //   setNoRouteFound('')
  //       // } else if (!isPriceFetching) {
  //       //   setBestRoutes([])
  //       //   setNoRouteFound('No trade found')
  //       // }
  //     }
  //   })
  // }, [
  //   amount,
  //   swapAmounts,
  //   // route,
  //   // isPriceFetching,
  //   setSlippageAmount,
  //   // setBestRoutes,
  //   // setNoRouteFound,
  //   setOutputAmount,
  //   // setPriceFetching,
  // ])

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
