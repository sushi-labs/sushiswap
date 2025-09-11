'use client'

import type { V2Pool, V3Pool } from '@sushiswap/graph-client/data-api'
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import {
  getTokensFromPool,
  useTokenAmountDollarValues,
  useUnderlyingTokenBalanceFromPool,
} from 'src/lib/hooks'
import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'

interface PoolPositionContext {
  balance: Amount<EvmCurrency> | null | undefined
  value0: number
  value1: number
  underlying0: Amount<EvmCurrency> | undefined
  underlying1: Amount<EvmCurrency> | undefined
  isLoading: boolean
  isError: boolean
}

const Context = createContext<PoolPositionContext | undefined>(undefined)

export const PoolPositionProvider: FC<{
  pool: NonNullable<V2Pool | V3Pool>
  children: ReactNode
  watch?: boolean
}> = ({ pool, children }) => {
  const { liquidityToken, reserve0, reserve1, totalSupply } = useMemo(() => {
    if (!pool)
      return {
        token0: undefined,
        token1: undefined,
        liquidityToken: undefined,
      }

    const { token0, token1, liquidityToken } = getTokensFromPool(pool)

    return {
      liquidityToken,
      reserve0: token0 && pool ? new Amount(token0, pool.reserve0) : null,
      reserve1: token1 && pool ? new Amount(token1, pool.reserve1) : null,
      totalSupply:
        liquidityToken && pool
          ? new Amount(liquidityToken, pool.liquidity)
          : null,
    }
  }, [pool])

  const { data: balance, isLoading, isError } = useAmountBalance(liquidityToken)

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserve0,
    reserve1,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = underlying
  const [value0, value1] = useTokenAmountDollarValues({
    chainId: pool.chainId,
    amounts: underlying,
  })

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          value0,
          value1,
          underlying0,
          underlying1,
          isLoading,
          isError,
        }),
        [balance, isError, isLoading, underlying0, underlying1, value0, value1],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const usePoolPosition = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Position Context')
  }

  return context
}
