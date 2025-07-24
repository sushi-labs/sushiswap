'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChipInput } from '@sushiswap/ui'
import React, { type FC, useCallback, useState, useTransition } from 'react'

import { usePoolFilters, useSetPoolFilters } from './PoolsFiltersProvider'

export const TableFiltersSearchToken: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { tokenSymbols } = usePoolFilters()
  const setFilters = useSetPoolFilters()
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
    <div>
      <ChipInput
        size="sm"
        icon={MagnifyingGlassIcon}
        delimiters={[',', ' ', ';', ':', 'Enter']}
        variant="outline"
        values={isPending ? values : (tokenSymbols ?? [])}
        onValueChange={onValueChange}
        placeholder="Search"
        maxValues={3}
        className="w-[250px] md:w-[300px] !bg-slate-200 dark:!bg-slate-750"
      />
    </div>
  )
}
