import { Toggle } from '@sushiswap/ui'
import React, { FC } from 'react'

import { usePoolFilters } from '../../../PoolsFiltersProvider'

export const TableFiltersFarmsOnly: FC = () => {
  const { farmsOnly, setFilters } = usePoolFilters()

  return (
    <Toggle onPressedChange={() => setFilters({ farmsOnly: !farmsOnly })} pressed={farmsOnly} size="sm">
      <span>🧑‍🌾</span> Farms only
    </Toggle>
  )
}
