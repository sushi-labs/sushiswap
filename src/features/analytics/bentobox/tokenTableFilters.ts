// import { Fee } from '@sushiswap/trident-sdk'

type FilterSymbolsFunc<T> = (
  arg0: { original: { token: { name: string; symbol: string } } }[],
  arg1: string[],
  arg2: T
) => any[]

export const filterForSearchQuery: FilterSymbolsFunc<{ searchQuery: string }> = (rows, id, filterValue) => {
  return rows.filter(({ original }) => {
    // Allow searching for symbol (LINK) or name (chainlink)
    const searchableText = original?.token?.name?.concat(original?.token?.symbol)?.toLowerCase()

    return !filterValue.searchQuery.length || searchableText.includes(filterValue.searchQuery.toLowerCase())
  })
}
