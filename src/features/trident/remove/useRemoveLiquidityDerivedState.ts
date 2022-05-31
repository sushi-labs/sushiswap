import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Percent, Token, ZERO } from '@sushiswap/core-sdk'
import { PoolState } from '@sushiswap/trident-sdk'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { selectRemovePercentageAmount, selectRemoveZapCurrency } from 'app/features/trident/remove/removeSlice'
import { toAmountCurrencyAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

type UseRemoveLiquidityZapCurrency = () => Currency | undefined
export const useRemoveLiquidityZapCurrency: UseRemoveLiquidityZapCurrency = () => {
  const zapCurrency = useSelector(selectRemoveZapCurrency)
  return useCurrency(zapCurrency) ?? undefined
}

type useRemoveLiquidityDerivedSLPAmount = () => CurrencyAmount<Token> | undefined
export const useRemoveLiquidityDerivedSLPAmount: useRemoveLiquidityDerivedSLPAmount = () => {
  const { poolBalance } = usePoolContext()
  const percentageAmount = useSelector(selectRemovePercentageAmount)
  return useMemo(() => {
    return poolBalance?.multiply(new Percent(percentageAmount, '100'))
  }, [percentageAmount, poolBalance])
}

type UseRemoveLiquidityDerivedCurrencyAmounts = () => (CurrencyAmount<Currency> | undefined)[]
export const useRemoveLiquidityDerivedCurrencyAmounts: UseRemoveLiquidityDerivedCurrencyAmounts = () => {
  const { poolWithState, totalSupply, rebases } = usePoolContext()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()

  return useMemo(() => {
    if (
      poolWithState?.pool &&
      slpAmountToRemove &&
      totalSupply &&
      totalSupply?.greaterThan(ZERO) &&
      rebases?.[poolWithState.pool.token0.wrapped.address] &&
      rebases?.[poolWithState.pool.token1.wrapped.address]
    )
      return [
        toAmountCurrencyAmount(
          rebases[poolWithState.pool.token0.wrapped.address],
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token0, totalSupply, slpAmountToRemove)
        ),
        toAmountCurrencyAmount(
          rebases[poolWithState.pool.token1.wrapped.address],
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token1, totalSupply, slpAmountToRemove)
        ),
      ]

    return [undefined, undefined]
  }, [poolWithState?.pool, rebases, slpAmountToRemove, totalSupply])
}

export const useRemoveLiquidityDerivedCurrencyAmountSingle = () => {
  const { poolWithState, totalSupply, rebases } = usePoolContext()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()
  const zapCurrency = useRemoveLiquidityZapCurrency()

  return poolWithState?.pool &&
    slpAmountToRemove &&
    totalSupply &&
    totalSupply?.greaterThan(ZERO) &&
    zapCurrency &&
    rebases?.[zapCurrency.wrapped.address]
    ? toAmountCurrencyAmount(
        rebases[zapCurrency?.wrapped.address],
        poolWithState.pool.getLiquidityValueSingleToken(
          zapCurrency?.wrapped,
          totalSupply.add(slpAmountToRemove),
          slpAmountToRemove.add(slpAmountToRemove)
        )
      )
    : undefined
}

type UseRemoveLiquidityDerivedInputError = () => string
export const useRemoveLiquidityDerivedInputError: UseRemoveLiquidityDerivedInputError = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const { poolWithState, poolBalance } = usePoolContext()
  const slpAmountToRemove = useRemoveLiquidityDerivedSLPAmount()

  return !account
    ? i18n._(t`Connect Wallet`)
    : poolWithState?.state === PoolState.INVALID
    ? i18n._(t`Invalid pool`)
    : !slpAmountToRemove?.greaterThan(ZERO)
    ? i18n._(t`Enter a percentage`)
    : poolBalance?.lessThan(slpAmountToRemove)
    ? i18n._(t`Insufficient Balance`)
    : poolBalance?.equalTo(ZERO)
    ? i18n._(t`No Balance`)
    : ''
}
