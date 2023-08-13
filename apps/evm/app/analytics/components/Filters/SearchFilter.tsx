import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@sushiswap/hooks'
import { TextField } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'

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

  return (
    <TextField
      placeholder="Search by token or address"
      icon={MagnifyingGlassIcon}
      type="text"
      id="search"
      value={_query}
      onValueChange={setQuery}
    />
  )
}
