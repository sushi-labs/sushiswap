import { useIsMounted } from '@sushiswap/hooks'
import { useSwapActions, useSwapState } from 'app/swap/trade/TradeProvider'
import React, { useEffect, useTransition } from 'react'
import { useSwapRouter } from 'utils/useSwapRouter'
import { TradeInput } from './TradeInput'

export const SwapTradeInput = () => {
  const [, startTransition] = useTransition()

  const isMounted = useIsMounted()
  const { amount, token0 } = useSwapState()

  const {
    setAmount,
    setToken0,
    setOutputAmount,
    setPriceFetching,
    setSlippageAmount,
    setBestRoutes,
    setNoRouteFound,
  } = useSwapActions()

  const { data: route, isFetching: isPriceFetching } = useSwapRouter()

  useEffect(() => {
    startTransition(() => {
      setOutputAmount('')
      setSlippageAmount(0)
      setNoRouteFound('')
      setPriceFetching(isPriceFetching)
      if (Number(amount) > 0) {
        if (route?.amountOut) {
          setOutputAmount(String(route?.amountOut))
          setSlippageAmount(route?.amountOut)
        }
        if (route?.route) {
          setBestRoutes(route?.route)
          setNoRouteFound('')
        } else {
          setBestRoutes([])
          setNoRouteFound('No trade found')
        }
      }
    })
  }, [
    amount,
    route,
    isPriceFetching,
    setSlippageAmount,
    setBestRoutes,
    setNoRouteFound,
    setOutputAmount,
    setPriceFetching,
  ])

  if (!isMounted) return <></>

  return (
    <TradeInput
      id="swap-from"
      type="INPUT"
      onSelect={setToken0}
      token={token0}
      value={String(amount)}
      onChange={setAmount}
      className="border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl"
    />
  )
}
