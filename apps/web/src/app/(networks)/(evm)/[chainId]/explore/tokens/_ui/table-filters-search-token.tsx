'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChipInput } from '@sushiswap/ui'
import React, { type FC, useCallback, useState, useTransition } from 'react'

import { useSetTokenFilters, useTokenFilters } from './tokens-filters-provider'

export const TableFiltersSearchToken: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { tokenSymbols } = useTokenFilters()
  const setFilters = useSetTokenFilters()
  const [values, setValues] = useState<string[]>(tokenSymbols)

  const onValueChange = useCallback(
    (values: string[]) => {
      setValues(values)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          tokenSymbols: values.map((value) => value.trim()),
        }))
      })
    },
    [setFilters],
  )

  return (
    <div className="w-full md:w-auto">
      <ChipInput
        aria-label="Search tokens"
        className="min-w-0"
        size="sm"
        icon={MagnifyingGlassIcon}
        delimiters={[',', ' ', ';', ':', 'Enter']}
        variant="outline"
        values={isPending ? values : (tokenSymbols ?? [])}
        onValueChange={onValueChange}
        placeholder="Search tokens"
        maxValues={3}
      />
    </div>
  )
}
