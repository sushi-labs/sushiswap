import { useDebounce } from '@sushiswap/hooks'
import { Decimal } from 'decimal.js-light'
import { useEffect, useMemo } from 'react'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { token0, amountIn, token1, isTxnPending } = useSwapState()
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

    const parsedAmountIn = Number.parseFloat(debouncedAmountIn)
    if (Number.isNaN(parsedAmountIn)) {
      return 0
    }
    const amtIn = new Decimal(parsedAmountIn)
    const r0 = new Decimal(data?.poolData?.reserve0)
    const r1 = new Decimal(data?.poolData?.reserve1)
    const isInputToken0 = token0?.tokenAddress === data?.poolData?.token0

    const reserveIn = isInputToken0 ? r0 : r1
    const reserveOut = isInputToken0 ? r1 : r0

    if (amtIn.lte(0) || r0.lte(0) || r1.lte(0)) return 0

    // amountIn with 0.3% fee
    const amountInWithFee = amtIn.mul(0.997)
    const numerator = amountInWithFee.mul(reserveOut)
    const denominator = reserveIn.add(amountInWithFee)
    const amountOut = numerator.div(denominator)

    const idealAmountOut = amtIn.mul(reserveOut).div(reserveIn)
    const priceImpact = idealAmountOut
      .sub(amountOut)
      .div(idealAmountOut)
      .mul(100)
      .toNumber()

    return priceImpact
  }, [data, debouncedAmountIn, token0])

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

  useEffect(() => {
    const _amountIn = Number(amountIn)
    if (_amountIn === 0 || Number.isNaN(_amountIn)) {
      setAmountOut('')
    }
  }, [amountIn, setAmountOut])

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
      isTxnPending={isTxnPending}
    />
  )
}
