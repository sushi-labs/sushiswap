import { Currency, CurrencyAmount, Percent } from '@sushiswap/core-sdk'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { useRemoveLiquidityDerivedSLPAmount } from 'app/features/trident/remove/useRemoveLiquidityDerivedState'
import { calculateSlippageAmount, toAmountCurrencyAmount } from 'app/functions'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useCallback, useMemo } from 'react'

export const useRemoveDetails = () => {
  const {
    poolWithState,
    totalSupply,
    poolBalance,
    rebases,
    poolShare: poolShareBefore,
    liquidityValue: liquidityValueBefore,
    currencies,
  } = usePoolContext()
  const slpAmount = useRemoveLiquidityDerivedSLPAmount()
  const slippage = useAppSelector(selectSlippage)

  // Returns the resulting pool share after execution
  const poolShareAfter = useMemo(() => {
    if (slpAmount && totalSupply && poolBalance) {
      return new Percent(poolBalance.subtract(slpAmount).quotient, totalSupply.subtract(slpAmount).quotient)
    }

    return undefined
  }, [poolBalance, slpAmount, totalSupply])

  // Returns the resulting withdrawn tokens after execution
  const liquidityValueAfter = useMemo(() => {
    if (
      slpAmount &&
      poolWithState?.pool &&
      totalSupply &&
      liquidityValueBefore[0] &&
      liquidityValueBefore[1] &&
      rebases?.[liquidityValueBefore[0].currency.wrapped.address] &&
      rebases?.[liquidityValueBefore[1].currency.wrapped.address]
    ) {
      return [
        liquidityValueBefore[0].subtract(
          toAmountCurrencyAmount(
            rebases[liquidityValueBefore[0].currency.wrapped.address],
            poolWithState.pool.getLiquidityValue(liquidityValueBefore[0].currency, totalSupply, slpAmount)
          )
        ),
        liquidityValueBefore[1].subtract(
          toAmountCurrencyAmount(
            rebases[liquidityValueBefore[1].currency.wrapped.address],
            poolWithState.pool.getLiquidityValue(liquidityValueBefore[1].currency, totalSupply, slpAmount)
          )
        ),
      ]
    }

    return [undefined, undefined]
  }, [liquidityValueBefore, poolWithState?.pool, rebases, slpAmount, totalSupply])

  const minLiquidityOutput = useMemo(() => {
    if (
      poolWithState?.pool &&
      totalSupply &&
      slpAmount &&
      currencies[0] &&
      currencies[1] &&
      rebases?.[poolWithState?.pool.token0.wrapped.address] &&
      rebases?.[poolWithState?.pool.token1.wrapped.address]
    ) {
      const amounts = [
        calculateSlippageAmount(
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token0, totalSupply, slpAmount),
          slippage
        )[0],
        calculateSlippageAmount(
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token1, totalSupply, slpAmount),
          slippage
        )[0],
      ]

      return [
        toAmountCurrencyAmount(
          rebases[poolWithState.pool.token0.wrapped.address],
          CurrencyAmount.fromRawAmount(poolWithState.pool.token0, amounts[0].toString())
        ),
        toAmountCurrencyAmount(
          rebases[poolWithState.pool.token1.wrapped.address],
          CurrencyAmount.fromRawAmount(poolWithState.pool.token1, amounts[1].toString())
        ),
      ]
    }

    return [undefined, undefined]
  }, [currencies, poolWithState?.pool, rebases, slippage, slpAmount, totalSupply])

  const minLiquidityOutputSingleToken = useCallback(
    (currency?: Currency) => {
      if (poolWithState?.pool && totalSupply && slpAmount && currency && rebases?.[currency.wrapped.address]) {
        const amount = calculateSlippageAmount(
          poolWithState.pool.getLiquidityValueSingleToken(currency.wrapped, totalSupply, slpAmount),
          slippage
        )[0]

        return toAmountCurrencyAmount(
          rebases[currency.wrapped.address],
          CurrencyAmount.fromRawAmount(currency.wrapped, amount.toString())
        )
      }

      return undefined
    },
    [poolWithState?.pool, rebases, slippage, slpAmount, totalSupply]
  )

  return useMemo(
    () => ({
      poolShareBefore,
      poolShareAfter,
      liquidityValueAfter,
      minLiquidityOutput,
      minLiquidityOutputSingleToken,
      liquidityValueBefore,
    }),
    [
      poolShareBefore,
      poolShareAfter,
      liquidityValueAfter,
      minLiquidityOutput,
      minLiquidityOutputSingleToken,
      liquidityValueBefore,
    ]
  )
}
