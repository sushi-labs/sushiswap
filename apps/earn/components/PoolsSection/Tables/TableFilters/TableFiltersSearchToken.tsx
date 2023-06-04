import { useDebounce } from '@sushiswap/hooks'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { Search } from '@sushiswap/ui/future/components/input/Search'

export const TableFiltersSearchToken: FC = () => {
  const { tokenSymbols, setFilters } = usePoolFilters()
  const [_query, setQuery] = useState<string>(tokenSymbols ? tokenSymbols.join(' ') : '')
  const debouncedQuery = useDebounce(_query, 400)

  useEffect(() => {
    if (tokenSymbols?.join(' ') !== debouncedQuery) {
      setFilters({ tokenSymbols: debouncedQuery.split(' ') })
    }
  }, [_query, debouncedQuery, setFilters, tokenSymbols])

  return <Search id="search" value={_query} loading={false} onChange={setQuery} className="max-w-full" delimiter=" " />
}
