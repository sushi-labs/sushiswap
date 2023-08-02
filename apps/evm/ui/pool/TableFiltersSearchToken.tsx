'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChipInput } from '@sushiswap/ui'
import React, { FC, useCallback } from 'react'

import { usePoolFilters, useSetPoolFilters } from './PoolsFiltersProvider'

export const TableFiltersSearchToken: FC = () => {
  const { tokenSymbols } = usePoolFilters()
  const setFilters = useSetPoolFilters()

  const onValueChange = useCallback(
    (values: string[]) => {
      setFilters((prev) => ({ ...prev, tokenSymbols: values }))
    },
    [setFilters]
  )

  return (
    <div>
      <ChipInput
        size="sm"
        icon={MagnifyingGlassIcon}
        delimiters={[',', ' ', ';', ':']}
        variant="outline"
        values={tokenSymbols ?? []}
        onValueChange={onValueChange}
        placeholder="Search"
      />
    </div>
  )
}
