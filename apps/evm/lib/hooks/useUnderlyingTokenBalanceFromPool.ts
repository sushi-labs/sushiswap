'use client'

import { Amount, Token, Type } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { useMemo } from 'react'

interface Params {
  totalSupply: Amount<Token> | undefined | null
  reserve0: Amount<Type> | undefined | null
  reserve1: Amount<Type> | undefined | null
  balance: Amount<Type> | undefined | null
}

type UseUnderlyingTokenBalanceFromPairParams = (params: Params) => [Amount<Type> | undefined, Amount<Type> | undefined]

export const useUnderlyingTokenBalanceFromPool: UseUnderlyingTokenBalanceFromPairParams = ({
  balance,
  totalSupply,
  reserve1,
  reserve0,
}) => {
  return useMemo(() => {
    if (!balance || !totalSupply || !reserve0 || !reserve1) {
      return [undefined, undefined]
    }

    if (totalSupply.equalTo(ZERO)) {
      return [
        Amount.fromRawAmount(reserve0.wrapped.currency, '0'),
        Amount.fromRawAmount(reserve1.wrapped.currency, '0'),
      ]
    }

    return [
      reserve0.wrapped.multiply(balance.wrapped.divide(totalSupply)),
      reserve1.wrapped.multiply(balance.wrapped.divide(totalSupply)),
    ]
  }, [balance, reserve0, reserve1, totalSupply])
}
