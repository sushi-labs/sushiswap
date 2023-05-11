import { useDebounce } from '@sushiswap/hooks'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { Search } from '@sushiswap/ui/future/components/input/Search'

export const TableFiltersSearchToken: FC = () => {
  const { tokenSymbols, setFilters } = usePoolFilters()

  const [_query, setQuery] = useState<string>(tokenSymbols?.[0] ?? '')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra] = useState(false)

  const debouncedQuery = useDebounce(_query, 400)
  const debouncedExtraQuery = useDebounce(_extraQuery, 400)

  useEffect(() => {
    if (!(debouncedExtraQuery || debouncedQuery) && tokenSymbols) {
      setFilters({ tokenSymbols: undefined })
    } else {
      setFilters({ tokenSymbols: [debouncedQuery, debouncedExtraQuery].filter((query) => query !== '') })
    }
  }, [debouncedExtraQuery, debouncedQuery, setFilters])

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setExtraQuery('')
      }, 750)
    }
  }, [extra, setFilters])

  return <Search id="search" value={_query} loading={false} onChange={setQuery} className="max-w-[300px]" />
}
