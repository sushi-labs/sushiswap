import { Currency, CurrencyAmount, JSBI, Percent, Rebase, Token, ZERO } from '@sushiswap/core-sdk'
import { ConstantProductPool, PoolState } from '@sushiswap/trident-sdk'
import useCurrenciesFromURL from 'app/features/trident/useCurrenciesFromURL'
import { toAmountCurrencyAmount } from 'app/functions'
import useBentoRebases from 'app/hooks/useBentoRebases'
import { useConstantProductPool } from 'app/hooks/useConstantProductPools'
import { useTotalSupply } from 'app/hooks/useTotalSupply'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenBalance } from 'app/state/wallet/hooks'
import { PoolWithState } from 'app/types'
import React, { createContext, FC, useContext, useMemo } from 'react'

interface PoolContext {
  poolWithState?: PoolWithState<ConstantProductPool>
  totalSupply?: CurrencyAmount<Token>
  poolBalance?: CurrencyAmount<Token>
  rebases?: Record<string, Rebase>
  noLiquidity?: boolean
  poolShare?: Percent
  liquidityValue: (CurrencyAmount<Token> | undefined)[]
  currencies: (Currency | undefined)[]
}

const Context = createContext<PoolContext | undefined>(undefined)

const PoolContext: FC = ({ children }) => {
  const { account } = useActiveWeb3React()
  const { currencies, twap, fee } = useCurrenciesFromURL()

  const poolWithState = useConstantProductPool(currencies[0], currencies[1], fee, twap)

  const totalSupply = useTotalSupply(poolWithState?.pool?.liquidityToken)
  const poolBalance = useTokenBalance(account ?? undefined, poolWithState?.pool?.liquidityToken)
  const { rebases, loading: rebasesLoading } = useBentoRebases([
    poolWithState?.pool?.token0,
    poolWithState?.pool?.token1,
  ])

  const noLiquidity = useMemo(() => {
    return (
      poolWithState.state === PoolState.NOT_EXISTS ||
      Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
      Boolean(
        poolWithState.pool &&
          JSBI.equal(poolWithState.pool.reserve0.quotient, ZERO) &&
          JSBI.equal(poolWithState.pool.reserve1.quotient, ZERO)
      )
    )
  }, [poolWithState.pool, poolWithState.state, totalSupply])

  // Returns the current pool share
  const poolShare = useMemo(() => {
    if (poolWithState?.pool && totalSupply && poolBalance && totalSupply?.greaterThan(ZERO)) {
      return new Percent(poolBalance.quotient, totalSupply.quotient)
    }

    return undefined
  }, [poolBalance, poolWithState?.pool, totalSupply])

  // Returns the current deposited tokens
  const liquidityValue = useMemo(() => {
    if (
      poolWithState?.pool &&
      poolBalance &&
      totalSupply &&
      totalSupply?.greaterThan(ZERO) &&
      rebases?.[poolWithState.pool.token0.wrapped.address] &&
      rebases?.[poolWithState.pool.token1.wrapped.address]
    ) {
      // Convert from shares to amount
      return [
        toAmountCurrencyAmount(
          // @ts-ignore TYPE NEEDS FIXING
          rebases[poolWithState.pool.token0.wrapped.address],
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token0, totalSupply.wrapped, poolBalance.wrapped)
        ),
        toAmountCurrencyAmount(
          // @ts-ignore TYPE NEEDS FIXING
          rebases[poolWithState.pool.token1.wrapped.address],
          poolWithState.pool.getLiquidityValue(poolWithState.pool.token1, totalSupply.wrapped, poolBalance.wrapped)
        ),
      ]
    }

    return [undefined, undefined]
  }, [poolBalance, poolWithState?.pool, rebases, totalSupply])

  return (
    <Context.Provider
      // @ts-ignore TYPE NEEDS FIXING
      value={useMemo(
        () => ({
          poolWithState,
          totalSupply,
          poolBalance,
          rebases,
          noLiquidity,
          poolShare,
          liquidityValue,
          currencies,
        }),
        [currencies, liquidityValue, noLiquidity, poolBalance, poolShare, poolWithState, rebases, totalSupply]
      )}
    >
      {/*// Reduce renders by conditionally rendering here*/}
      {poolWithState.state !== PoolState.LOADING && !rebasesLoading && children}
    </Context.Provider>
  )
}

export const usePoolContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Context')
  }

  return context
}

export default PoolContext
