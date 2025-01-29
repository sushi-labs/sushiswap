import type { Currency, Token } from 'sushi/currency'

export const pairsUnique = (
  currencies: [Currency | undefined, Currency | undefined][],
) => {
  const pairsMap = new Map<string, [Token, Token]>()
  currencies.map(([c1, c2]) => {
    if (c1 && c2) {
      const addr1 = c1.wrapped.address as string | undefined
      const addr2 = c2.wrapped.address as string | undefined
      if (addr1 !== undefined && addr2 !== undefined) {
        if (addr1.toLowerCase() < addr2.toLowerCase())
          pairsMap.set(addr1 + addr2, [c1, c2] as [Token, Token])
        else pairsMap.set(addr2 + addr1, [c2, c1] as [Token, Token])
      }
    }
  })
  return Array.from(pairsMap.values())
}

export const tokensUnique = (_pairsUnique: [Token, Token][]) =>
  Array.from(
    new Set(
      _pairsUnique.reduce<Token[]>(
        (previousValue, currentValue) => previousValue.concat(currentValue),
        [],
      ),
    ),
  )
