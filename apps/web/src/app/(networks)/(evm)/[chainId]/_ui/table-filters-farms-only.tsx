'use client'

import { Button, classNames } from '@sushiswap/ui'
import React, { type FC, useCallback, useState } from 'react'
import {
  usePoolFilters,
  useSetPoolFilters,
} from 'src/app/(networks)/_ui/pools-filters-provider'

export const TableFiltersFarmsOnly: FC = () => {
  const { farmsOnly } = usePoolFilters()
  const setFilters = useSetPoolFilters()
  const [checked, setChecked] = useState(farmsOnly)

  const toggle = useCallback(
    (checked: boolean) => {
      setChecked(checked)
      setFilters((prev) => ({ ...prev, farmsOnly: !prev.farmsOnly }))
    },
    [setFilters],
  )

  return (
    <Button
      onClick={() => toggle(!checked)}
      variant={'outline'}
      role="combobox"
      size="sm"
      className={classNames(
        'border-dashed !bg-slate-200 dark:!bg-slate-750',
        'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue',
        farmsOnly
          ? '!bg-blue/10 dark:!bg-skyblue/10 !text-blue dark:!border-skyblue dark:!text-skyblue !border-blue !border-1 !border-solid'
          : '',
      )}
    >
      <span>🧑‍🌾</span> Farms only
    </Button>
  )
}
