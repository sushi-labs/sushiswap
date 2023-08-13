import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@sushiswap/hooks'
import { ChipInput } from '@sushiswap/ui'
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

  return (
    <ChipInput
      icon={MagnifyingGlassIcon}
      variant="secondary"
      values={tokenSymbols ?? []}
      onValueChange={(values: string[]) => setQuery(values.join(' '))}
      placeholder="Type and press enter to add tokens"
    />
  )
}
