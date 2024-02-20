'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC, useCallback, useState, useTransition } from 'react'

import {
  useBondPositionsFilters,
  useSetBondPositionsFilters,
} from './bonds-positions-filters-provider'

export const TableFiltersUnclaimedBondsOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { onlyUnclaimedBonds } = useBondPositionsFilters()
  const { setFilters } = useSetBondPositionsFilters()
  const [checked, setChecked] = useState(onlyUnclaimedBonds)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          onlyUnclaimedBonds:
            prev.onlyUnclaimedBonds === undefined ? false : undefined,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : onlyUnclaimedBonds === undefined}
      size="sm"
    >
      Unclaimed Bonds Only
    </Toggle>
  )
}
