import { CurrencyAmount } from '@sushiswap/core-sdk'
import { useAddLiquidityDerivedCurrencyAmounts } from 'app/features/trident/add/useAddLiquidityDerivedState'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { maxAmountSpend, toAmountCurrencyAmount, toShareCurrencyAmount, tryParseAmount } from 'app/functions'
import { useBentoOrWalletBalances } from 'app/hooks/useBentoOrWalletBalance'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useMemo } from 'react'

export type useDependentAssetInputs = (x: {
  fixedRatio: boolean
  spendFromWallet: [boolean, boolean]
  inputs: (string | undefined)[]
  // @ts-ignore TYPE NEEDS FIXING
  setInputs(x): void
}) => {
  // @ts-ignore TYPE NEEDS FIXING
  mainInput: [string, (string) => void]
  // @ts-ignore TYPE NEEDS FIXING
  secondaryInput: [string, (string) => void]
  onMax(): void
  isMax?: boolean
}

export const useDependentAssetInputs: useDependentAssetInputs = ({
  fixedRatio,
  spendFromWallet,
  inputs,
  setInputs,
}) => {
  const { account } = useActiveWeb3React()
  const { poolWithState, noLiquidity, rebases, currencies } = usePoolContext()
  const parsedAmounts = useAddLiquidityDerivedCurrencyAmounts()

  const handleMainInput = useCallback(
    (val: string) => {
      if (poolWithState?.pool && !noLiquidity && fixedRatio && currencies?.[0] && currencies?.[1]) {
        const [token0, token1] = [currencies[0].wrapped, currencies[1].wrapped]
        const amount = tryParseAmount(val, token0)

        if (token0 && token0 && amount && rebases?.[token0.address] && rebases?.[token1.address]) {
          const dependentTokenAmount = toAmountCurrencyAmount(
            rebases[token1.address],
            poolWithState.pool.priceOf(token0).quote(toShareCurrencyAmount(rebases[token0.address], amount))
          )

          setInputs([
            val,
            (currencies[1]?.isNative
              ? CurrencyAmount.fromRawAmount(currencies[1], dependentTokenAmount.quotient)
              : dependentTokenAmount
            ).toExact(),
          ])
          return
        }
      }

      // @ts-ignore TYPE NEEDS FIXING
      setInputs((prevState) => [val, Number(val) === 0 ? undefined : prevState[1]])
    },
    [currencies, fixedRatio, noLiquidity, poolWithState?.pool, rebases, setInputs]
  )

  const handleSecondaryInput = useCallback(
    (val: string) => {
      if (poolWithState?.pool && !noLiquidity && fixedRatio && currencies?.[0] && currencies?.[1]) {
        const [token0, token1] = [currencies[0].wrapped, currencies[1].wrapped]
        const amount = tryParseAmount(val, token1)

        if (token0 && token0 && amount && rebases?.[token0.address] && rebases?.[token1.address]) {
          const dependentTokenAmount = toAmountCurrencyAmount(
            rebases[token0.address],
            poolWithState.pool.priceOf(token1).quote(toShareCurrencyAmount(rebases[token1.address], amount))
          )

          setInputs([
            (currencies[0]?.isNative
              ? CurrencyAmount.fromRawAmount(currencies[0], dependentTokenAmount.quotient)
              : dependentTokenAmount
            ).toExact(),
            val,
          ])
          return
        }
      }

      // @ts-ignore TYPE NEEDS FIXING
      setInputs((prevState) => [Number(val) === 0 ? undefined : prevState[0], val])
    },
    [currencies, fixedRatio, noLiquidity, poolWithState?.pool, rebases, setInputs]
  )

  const balances = useBentoOrWalletBalances(account ?? undefined, currencies, spendFromWallet)

  const onMax = useCallback(async () => {
    if (!balances || !poolWithState?.pool || !balances[0] || !balances[1] || !currencies[0]) return
    if (!noLiquidity && fixedRatio) {
      if (poolWithState.pool.priceOf(currencies[0].wrapped).quote(balances[0].wrapped)?.lessThan(balances[1].wrapped)) {
        handleMainInput(maxAmountSpend(balances[0])?.toExact() || '')
      } else {
        handleSecondaryInput(maxAmountSpend(balances[1])?.toExact() || '')
      }
    } else {
      setInputs([maxAmountSpend(balances[0])?.toExact(), maxAmountSpend(balances[1])?.toExact()])
    }
  }, [
    balances,
    currencies,
    fixedRatio,
    handleMainInput,
    handleSecondaryInput,
    noLiquidity,
    poolWithState?.pool,
    setInputs,
  ])

  const isMax = useMemo(() => {
    if (!balances || !poolWithState?.pool || !balances[0] || !balances[1] || !currencies[0]) return false

    if (!noLiquidity && fixedRatio) {
      return poolWithState.pool.priceOf(currencies[0].wrapped).quote(balances[0].wrapped)?.lessThan(balances[1].wrapped)
        ? parsedAmounts[0]?.equalTo(maxAmountSpend(balances[0]) || '')
        : parsedAmounts[1]?.equalTo(maxAmountSpend(balances[1]) || '')
    } else {
      return (
        parsedAmounts[0]?.equalTo(maxAmountSpend(balances[0]) || '') &&
        parsedAmounts[1]?.equalTo(maxAmountSpend(balances[1]) || '')
      )
    }
  }, [balances, currencies, fixedRatio, noLiquidity, parsedAmounts, poolWithState?.pool])

  // If we change back to fixedRatio,
  // make sure to update second input
  useEffect(() => {
    if (fixedRatio && inputs[0] && inputs[1]) handleMainInput(inputs[0])
    else if (fixedRatio && inputs[0] && !inputs[1]) handleMainInput(inputs[0])
    else if (fixedRatio && inputs[1] && !inputs[0]) handleSecondaryInput(inputs[1])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedRatio])

  return useMemo(
    () => ({
      // @ts-ignore TYPE NEEDS FIXING
      mainInput: [inputs[0], handleMainInput] as [string, (string) => void],
      // @ts-ignore TYPE NEEDS FIXING
      secondaryInput: [inputs[1], handleSecondaryInput] as [string, (string) => void],
      onMax,
      isMax,
    }),
    [handleMainInput, handleSecondaryInput, inputs, isMax, onMax]
  )
}
