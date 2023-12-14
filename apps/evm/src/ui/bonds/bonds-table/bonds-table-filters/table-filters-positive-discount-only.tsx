'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC, useCallback, useState, useTransition } from 'react'

import { useBondFilters, useSetBondFilters } from './bonds-filters-provider'

export const TableFiltersPositiveDiscountOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { positiveDiscountsOnly } = useBondFilters()
  const setFilters = useSetBondFilters()
  const [checked, setChecked] = useState(positiveDiscountsOnly)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          positiveDiscountsOnly: !prev.positiveDiscountsOnly,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : positiveDiscountsOnly}
      size="sm"
    >
      Positive Discount Only
    </Toggle>
  )
}
