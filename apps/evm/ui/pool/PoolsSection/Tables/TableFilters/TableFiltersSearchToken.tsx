import { useDebounce } from '@sushiswap/hooks'
import { Search } from '@sushiswap/ui/components/input/Search'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'

export const TableFiltersSearchToken: FC = () => {
  const { tokenSymbols, setFilters } = usePoolFilters()
  const [_query, setQuery] = useState<string>(tokenSymbols ? tokenSymbols.join(' ') : '')
  const debouncedQuery = useDebounce(_query, 400)

  useEffect(() => {
    if (tokenSymbols?.join(' ') !== debouncedQuery) {
      setFilters({ tokenSymbols: debouncedQuery.split(' ').filter((f) => f !== '') })
    }
  }, [_query, debouncedQuery, setFilters, tokenSymbols])

  return <Search id="search" value={_query} loading={false} onValueChange={setQuery} delimiter=" " />
}
