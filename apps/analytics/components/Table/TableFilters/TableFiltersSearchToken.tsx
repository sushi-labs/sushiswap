import { Transition } from '@headlessui/react'
import { PlusIcon, SearchIcon, XCircleIcon } from '@heroicons/react/solid'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, IconButton } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'

import { SelectedTable, usePoolFilters } from '../../PoolsFiltersProvider'
import { Search } from '@sushiswap/ui/future/components/input/Search'

export const TableFiltersSearchToken: FC = () => {
  const { setFilters } = usePoolFilters()

  const [_query, setQuery] = useState<string>('')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra, setExtra] = useState(false)

  const debouncedQuery = useDebounce(_query, 400)
  const debouncedExtraQuery = useDebounce(_extraQuery, 400)

  useEffect(() => {
    if (!(debouncedExtraQuery || debouncedQuery)) {
      setFilters({ tokenSymbols: undefined })
    } else {
      setFilters({ tokenSymbols: [debouncedQuery, debouncedExtraQuery].filter((query) => query !== '') })
    }
  }, [_extraQuery, _query, debouncedExtraQuery, debouncedQuery, setFilters])

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setExtraQuery('')
      }, 750)
    }
  }, [extra, setFilters])

  return <Search id="search" value={_query} loading={false} onChange={setQuery} className="max-w-[300px]" />
}
