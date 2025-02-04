'use client'

import { Toggle } from '@sushiswap/ui'
import React, { type FC, useCallback, useState, useTransition } from 'react'

import { usePoolFilters, useSetPoolFilters } from './PoolsFiltersProvider'

export const TableFiltersSmartPoolsOnly: FC = () => {
  const [isPending, startTransition] = useTransition()
  const { smartPoolsOnly } = usePoolFilters()
  const setFilters = useSetPoolFilters()
  const [checked, setChecked] = useState(smartPoolsOnly)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      startTransition(() => {
        setFilters((prev) => ({
          ...prev,
          smartPoolsOnly: !prev.smartPoolsOnly,
        }))
      })
    },
    [setFilters],
  )

  return (
    <Toggle
      variant="outline"
      onPressedChange={toggle}
      pressed={isPending ? checked : smartPoolsOnly}
      size="sm"
    >
      <span>💡</span>Smart pool
    </Toggle>
  )
}
