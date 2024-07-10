'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC, useCallback, useState, useTransition } from 'react'

import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'

export const TableFiltersPositiveDiscountOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { onlyDiscounted } = useBondFilters()
  const { setFilters } = useSetBondFilters()
  const [checked, setChecked] = useState(onlyDiscounted)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          onlyDiscounted: !prev.onlyDiscounted ? true : undefined,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : onlyDiscounted}
      size="sm"
    >
      Positive Discount Only
    </Toggle>
  )
}
