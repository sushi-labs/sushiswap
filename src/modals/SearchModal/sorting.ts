import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import { useAllTokenBalances } from 'app/state/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: CurrencyAmount<Currency>, balanceB?: CurrencyAmount<Currency>) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  } else if (balanceA && balanceA.greaterThan('0')) {
    return -1
  } else if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

type TokenComparatorFn = (tokenA: Token, tokenB: Token) => number

export const useTokenComparator = (): TokenComparatorFn => {
  const balances = useAllTokenBalances()
  return (tokenA: Token, tokenB: Token): number => {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address]
    const balanceB = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}
