'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC, useCallback, useState, useTransition } from 'react'

import {
  useBondPositionsFilters,
  useSetBondPositionsFilters,
} from './bonds-positions-filters-provider'

export const TableFiltersUnredeemedOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { onlyUnredeemed } = useBondPositionsFilters()
  const { setFilters } = useSetBondPositionsFilters()
  const [checked, setChecked] = useState(onlyUnredeemed)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          onlyUnredeemed: prev.onlyUnredeemed === undefined ? false : undefined,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : onlyUnredeemed === undefined}
      size="sm"
    >
      Unredeemed Only
    </Toggle>
  )
}
