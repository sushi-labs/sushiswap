import { CurrencyAmount, Percent, ZERO } from '@sushiswap/core-sdk'
import { ZERO_PERCENT } from 'app/constants'
import { useAddLiquidityDerivedCurrencyAmounts } from 'app/features/trident/add/useAddLiquidityDerivedState'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { getPriceOfNewPool } from 'app/features/trident/utils'
import { calculateSlippageAmount, toShareCurrencyAmount } from 'app/functions'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useMemo } from 'react'

export const useAddDetails = () => {
  const {
    poolWithState,
    totalSupply,
    poolBalance,
    rebases,
    noLiquidity,
    poolShare: poolShareBefore,
    liquidityValue: liquidityValueBefore,
    currencies,
  } = usePoolContext()
  const slippage = useAppSelector(selectSlippage)
  const parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()

  // Returns the minimum SLP that will get minted given current input amounts
  const liquidityMinted = useMemo(() => {
    if (
      poolWithState?.pool &&
      totalSupply &&
      currencies[0] &&
      currencies[1] &&
      rebases?.[currencies[0].wrapped.address] &&
      rebases?.[currencies[1].wrapped.address]
    ) {
      const amountA = toShareCurrencyAmount(
        rebases[currencies[0].wrapped.address],
        parsedAmounts && parsedAmounts[0]
          ? parsedAmounts[0].wrapped
          : CurrencyAmount.fromRawAmount(currencies[0], '0').wrapped
      )

      const amountB = toShareCurrencyAmount(
        rebases[currencies[1].wrapped.address],
        parsedAmounts && parsedAmounts[1]
          ? parsedAmounts[1].wrapped
          : CurrencyAmount.fromRawAmount(currencies[1], '0').wrapped
      )

      // Both can't be zero
      if (amountA.equalTo(ZERO) && amountB.equalTo(ZERO)) return undefined

      try {
        const slp = poolWithState.pool.getLiquidityMinted(totalSupply, amountA, amountB)
        const minSLP = calculateSlippageAmount(slp, noLiquidity ? ZERO_PERCENT : slippage)[0]
        return CurrencyAmount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [currencies, noLiquidity, parsedAmounts, poolWithState?.pool, rebases, slippage, totalSupply])

  // Returns the resulting pool share after execution
  const poolShareAfter = useMemo(() => {
    if (liquidityMinted && totalSupply && poolBalance) {
      return new Percent(poolBalance.add(liquidityMinted).quotient, totalSupply.add(liquidityMinted).quotient)
    }

    return undefined
  }, [liquidityMinted, poolBalance, totalSupply])

  const price = useMemo(() => {
    if (noLiquidity && parsedAmounts) {
      return getPriceOfNewPool(parsedAmounts)
    } else if (parsedAmounts?.[1]) {
      return poolWithState?.pool && parsedAmounts[0]?.wrapped
        ? poolWithState?.pool.priceOf(parsedAmounts[1]?.currency.wrapped)
        : undefined
    }
    return undefined
  }, [noLiquidity, parsedAmounts, poolWithState?.pool])

  return useMemo(
    () => ({
      poolShareBefore,
      poolShareAfter,
      liquidityMinted,
      liquidityValueBefore,
      price,
    }),
    [poolShareBefore, poolShareAfter, liquidityMinted, liquidityValueBefore, price]
  )
}
