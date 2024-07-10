'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { TextField } from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import { useBlogSearch, useSetBlogSearch } from './blog-search-provider'

export function SearchFilter() {
  const { search } = useBlogSearch()
  const [value, setValue] = useState(search || '')
  const setFilters = useSetBlogSearch()

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
      variant="outline"
      icon={MagnifyingGlassIcon}
      onValueChange={handleInput}
      value={value}
      placeholder="Search articles"
    />
  )
}
