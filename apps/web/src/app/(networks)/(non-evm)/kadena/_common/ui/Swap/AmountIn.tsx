import { useDebounce } from '@sushiswap/hooks'
import { useEffect, useMemo } from 'react'
import { Amount } from 'sushi'
import { parseUnits } from 'viem'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useSwapDispatch, useSwapState } from '~kadena/swap/swap-provider'
import { TokenInput } from '../Input/TokenInput'

export const AmountIn = () => {
  const { token0, amountIn, token1, isTxnPending, amountInString } =
    useSwapState()
  const {
    setToken0,
    setAmountIn,
    setAmountOut,
    setRoute,
    setPriceImpactPercentage,
    setAmountInString,
    setAmountOutString,
  } = useSwapDispatch()
  const debouncedAmountIn = useDebounce<string | undefined>(amountInString, 250)

  const { data, isLoading: isLoadingPool } = usePoolFromTokens({
    token0: token0?.address,
    token1: token1?.address,
  })

  useEffect(() => {
    if (amountInString && token0) {
      const parsed = parseUnits(amountInString, token0.decimals)
      setAmountIn(new Amount(token0, parsed))
    } else {
      setAmountIn(undefined)
      setAmountOut(undefined)
      setAmountOutString('')
    }
  }, [amountInString, token0, setAmountIn, setAmountOut, setAmountOutString])

  const isLoadingAmount = isLoadingPool

  const calculatedPriceImpact: number = useMemo(() => {
    if (
      !data?.poolData?.reserve0 ||
      !data?.poolData?.reserve1 ||
      !debouncedAmountIn
    ) {
      return 0
    }

    if (!debouncedAmountIn) {
      return 0
    }
    const amtIn = new Amount(
      token0,
      parseUnits(debouncedAmountIn, token0?.decimals),
    )
    const r0 = new Amount(
      token0,
      parseUnits(data?.poolData?.reserve0.toString(), token0?.decimals),
    )
    const r1 = new Amount(
      token1,
      parseUnits(data?.poolData?.reserve1?.toString(), token1?.decimals),
    )

    const isInputToken0 = token0?.address === data?.poolData?.token0

    const reserveIn = isInputToken0 ? r0 : r1
    const reserveOut = isInputToken0 ? r1 : r0

    if (amtIn.lte(0n) || r0.lte(0n) || r1.lte(0n)) return 0

    // amountIn with 0.3% fee
    const amountInWithFee = amtIn.mulHuman(0.997)
    const numerator = amountInWithFee.mul(reserveOut)
    const denominator = reserveIn.add(amountInWithFee)
    const amountOut = numerator.divToFraction(denominator)

    const idealAmountOut = amtIn.mul(reserveOut).divToFraction(reserveIn)
    const priceImpact = idealAmountOut
      .sub(amountOut)
      .div(idealAmountOut)
      .mul(100)
      .toNumber()

    return priceImpact
  }, [data, debouncedAmountIn, token0, token1])

  //priceImpactPercentage
  useEffect(() => {
    setPriceImpactPercentage(calculatedPriceImpact)
  }, [calculatedPriceImpact, setPriceImpactPercentage])

  //routes
  useEffect(() => {
    if (data?.exists) {
      setRoute([token0?.address, token1?.address])
    } else {
      setRoute([])
      setAmountOut(undefined)
      setAmountOutString('')
    }
  }, [data, token0, token1, setRoute, setAmountOut, setAmountOutString])

  useEffect(() => {
    if (amountIn?.eq(0n) || !amountIn) {
      setAmountOut(undefined)
      setAmountOutString('')
    }
  }, [amountIn, setAmountOut, setAmountOutString])

  return (
    <TokenInput
      className="border border-accent"
      type="input"
      amount={amountInString}
      setAmount={setAmountInString}
      currency={token0}
      setToken={setToken0}
      label="Sell"
      isLoadingAmount={isLoadingAmount}
      isTxnPending={isTxnPending}
    />
  )
}
