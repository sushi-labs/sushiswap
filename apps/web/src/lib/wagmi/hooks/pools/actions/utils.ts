import type { EvmCurrency, EvmToken } from 'sushi/evm'

export const pairsUnique = (
  currencies: [EvmCurrency | undefined, EvmCurrency | undefined][],
) => {
  const pairsMap = new Map<string, [EvmToken, EvmToken]>()
  currencies.map(([c1, c2]) => {
    if (c1 && c2) {
      const addr1 = c1.wrap().address as string | undefined
      const addr2 = c2.wrap().address as string | undefined
      if (addr1 !== undefined && addr2 !== undefined) {
        if (addr1.toLowerCase() < addr2.toLowerCase())
          pairsMap.set(addr1 + addr2, [c1, c2] as [EvmToken, EvmToken])
        else pairsMap.set(addr2 + addr1, [c2, c1] as [EvmToken, EvmToken])
      }
    }
  })
  return Array.from(pairsMap.values())
}

export const tokensUnique = (_pairsUnique: [EvmToken, EvmToken][]) =>
  Array.from(
    new Set(
      _pairsUnique.reduce<EvmToken[]>(
        (previousValue, currentValue) => previousValue.concat(currentValue),
        [],
      ),
    ),
  )
