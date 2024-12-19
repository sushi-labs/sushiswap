'use client'

import { Select, SelectContent, SelectItem, SelectTrigger } from '@sushiswap/ui'
import { useState } from 'react'
import { SORTING_OPTIONS } from 'src/app/(cms)/constants'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../components/academy-search-provider'

export function SortByDropdown() {
  const { sorting } = useAcademySearch()
  const setFilters = useSetAcademySearch()

  const [sortByIndex, setSortByIndex] = useState(
    sorting
      ? `${SORTING_OPTIONS.findIndex((option) => option.key === sorting)}`
      : '0',
  )

  const onSelect = (index: string) => {
    setSortByIndex(index)
    setFilters((filters) => {
      return {
        ...filters,
        sorting: SORTING_OPTIONS[+index].key,
      }
    })
  }

  return (
    <Select value={sortByIndex} onValueChange={onSelect}>
      <SelectTrigger>
        {sorting ? SORTING_OPTIONS[+sortByIndex].name : 'Sort By'}
      </SelectTrigger>
      <SelectContent>
        {SORTING_OPTIONS?.map((option, i) => (
          <SelectItem key={option.key} value={`${i}`}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
