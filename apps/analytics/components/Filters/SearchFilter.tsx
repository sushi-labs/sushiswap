import { useDebounce } from '@sushiswap/hooks'
import React, { FC, useEffect, useState } from 'react'

import { Search } from '@sushiswap/ui/future/components/input/Search'
import { useFilters } from './FilterProvider'

export const SearchFilter: FC = () => {
  const { setFilters } = useFilters()

  const [_query, setQuery] = useState<string>('')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra, setExtra] = useState(false)

  const debouncedQuery = useDebounce(_query, 400)
  const debouncedExtraQuery = useDebounce(_extraQuery, 400)

  useEffect(() => {
    if (!(debouncedExtraQuery || debouncedQuery)) {
      setFilters({ search: undefined })
    } else {
      setFilters({ search: [debouncedQuery, debouncedExtraQuery].filter((query) => query !== '') })
    }
  }, [_extraQuery, _query, debouncedExtraQuery, debouncedQuery, setFilters])

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setExtraQuery('')
      }, 750)
    }
  }, [extra, setFilters])

  return <Search id="search" value={_query} loading={false} onChange={setQuery} className="max-w-full" />
}
