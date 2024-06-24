'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TextField } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import {
  useAcademySearch,
  useSetAcademySearch,
} from '../../components/academy-search-provider'

export function SearchFilter() {
  const { search } = useAcademySearch()
  const [value, setValue] = useState(search || '')
  const setFilters = useSetAcademySearch()

  const handleInput = useCallback(
    (value: string) => {
      setValue(value)

      if (value.length === 0) {
        return setFilters((prev) => ({
          ...prev,
          search: undefined,
        }))
      }

      setFilters((prev) => ({
        ...prev,
        search: value,
      }))
    },
    [setFilters],
  )

  return (
    <TextField
      type="text"
      variant="default"
      icon={MagnifyingGlassIcon}
      onValueChange={handleInput}
      value={value}
      placeholder="Search articles"
    />
  )
}
