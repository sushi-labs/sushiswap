import { useDebounce } from '@sushiswap/hooks'
import { useEffect, useMemo } from 'react'
import { Decimal } from 'sushi'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { token0, amountIn, token1 } = useSwapState()
  const {
    setToken0,
    setAmountIn,
    setAmountOut,
    setRoute,
    setPriceImpactPercentage,
  } = useSwapDispatch()
  const debouncedAmountIn = useDebounce(amountIn, 250)

  const { data, isLoading: isLoadingPool } = usePoolFromTokens({
    token0: token0?.tokenAddress,
    token1: token1?.tokenAddress,
  })

  const isLoadingAmount = isLoadingPool

  const calculatedPriceImpact: number = useMemo(() => {
    if (
      !data?.poolData?.reserve0 ||
      !data?.poolData?.reserve1 ||
      !debouncedAmountIn
    ) {
      return 0
    }
    const k = new Decimal(data?.poolData?.reserve0).mul(
      data?.poolData?.reserve1,
    )
    const newReserveX = new Decimal(data?.poolData?.reserve0).plus(
      debouncedAmountIn,
    )
    const newReserveY = k.div(newReserveX)
    const receivedTokenY = new Decimal(data?.poolData?.reserve1).minus(
      newReserveY,
    )
    const priceImpact = receivedTokenY.div(newReserveY).mul(100)
    if (Number(priceImpact) > 100) {
      return 100
    }
    return priceImpact.toNumber()
  }, [data?.poolData?.reserve0, data?.poolData?.reserve1, debouncedAmountIn])

  //priceImpactPercentage
  useEffect(() => {
    setPriceImpactPercentage(calculatedPriceImpact)
  }, [calculatedPriceImpact, setPriceImpactPercentage])

  //routes
  useEffect(() => {
    if (data?.exists) {
      setRoute([token0?.tokenAddress, token1?.tokenAddress])
    } else {
      setRoute([])
    }
  }, [data, token0, token1, setRoute])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Typecheck speedup
  useEffect(() => {
    const _amountIn = Number(amountIn)
    if (_amountIn === 0 || Number.isNaN(_amountIn)) {
      setAmountOut('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountIn])

  return (
    <TokenInput
      className="border border-accent"
      type="input"
      amount={amountIn}
      setAmount={(amount) => {
        setAmountIn(amount)
      }}
      currency={token0}
      setToken={setToken0}
      label="Sell"
      isLoadingAmount={isLoadingAmount}
    />
  )
}
