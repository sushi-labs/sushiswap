'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC, useCallback, useState, useTransition } from 'react'

import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'

export const TableFiltersOpenOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { onlyOpen } = useBondFilters()
  const { setFilters } = useSetBondFilters()
  const [checked, setChecked] = useState(onlyOpen)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          onlyOpen: prev.onlyOpen === undefined ? false : undefined,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : onlyOpen === undefined}
      size="sm"
    >
      Open Markets Only
    </Toggle>
  )
}
