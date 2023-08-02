'use client'

import { Toggle } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFilters, useSetPoolFilters } from '../../../PoolsFiltersProvider'

export const TableFiltersFarmsOnly: FC = () => {
  const { farmsOnly } = usePoolFilters()
  const setFilters = useSetPoolFilters()

  return (
    <Toggle
      onPressedChange={() => setFilters((prev) => ({ ...prev, farmsOnly: !prev.farmsOnly }))}
      pressed={farmsOnly}
      size="sm"
    >
      <span>🧑‍🌾</span> Farms only
    </Toggle>
  )
}
