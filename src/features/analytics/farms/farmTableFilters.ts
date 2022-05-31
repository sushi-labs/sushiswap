type FilterSymbolsFunc<T> = (
  arg0: {
    original: {
      pair: {
        name: string
        symbol: string
        token0: { name: string; symbol: string }
        token1: { name: string; symbol: string }
      }
    }
  }[],
  arg1: string[],
  arg2: T
) => any[]

export const filterForSearchQuery: FilterSymbolsFunc<{ searchQuery: string }> = (rows, id, filterValue) => {
  return rows.filter(({ original }) => {
    const searchableText = original?.pair?.token0?.symbol
      ?.concat(original?.pair?.token0?.name)
      ?.concat(original?.pair?.token1?.symbol)
      ?.concat(original?.pair?.token1?.name)
      ?.toLowerCase()

    return !filterValue.searchQuery.length || searchableText.includes(filterValue.searchQuery.toLowerCase())
  })
}
