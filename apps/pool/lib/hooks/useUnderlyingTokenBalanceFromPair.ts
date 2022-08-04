import { Amount, Token } from '@sushiswap/currency'
import { useMemo } from 'react'

interface Params {
  totalSupply: Amount<Token>
  reserve0: Amount<Token>
  reserve1: Amount<Token>
  balance: Amount<Token> | undefined
}

type UseUnderlyingTokenBalanceFromPairParams = (
  params: Params
) => [Amount<Token> | undefined, Amount<Token> | undefined]

export const useUnderlyingTokenBalanceFromPair: UseUnderlyingTokenBalanceFromPairParams = ({
  balance,
  totalSupply,
  reserve1,
  reserve0,
}) => {
  return useMemo(() => {
    if (!balance || !totalSupply || !reserve0 || !reserve1) {
      return [undefined, undefined]
    }

    return [reserve0.multiply(balance.divide(totalSupply)), reserve1.multiply(balance.divide(totalSupply))]
  }, [balance, reserve0, reserve1, totalSupply])
}
