'use client'

import { Button, classNames } from '@sushiswap/ui'
import React, { type FC, useCallback } from 'react'
import {
  usePoolFilters,
  useSetPoolFilters,
} from 'src/app/(networks)/_ui/pools-filters-provider'
import { SushiSwapProtocol } from 'sushi/evm'

export const POOL_TYPES = [
  SushiSwapProtocol.SUSHISWAP_V3,
  SushiSwapProtocol.SUSHISWAP_V2,
]

export const TableFiltersPoolTypeV2: FC = () => {
  const { protocols } = usePoolFilters()
  const setFilters = useSetPoolFilters()

  const handleProtocolSelect = useCallback(
    (item: SushiSwapProtocol) => {
      let _newValues: SushiSwapProtocol[] = []

      if (protocols.includes(item) && protocols.length === 1) {
        _newValues = POOL_TYPES
      } else {
        _newValues = [item]
      }
      setFilters((prev) => {
        return { ...prev, protocols: _newValues }
      })
    },
    [setFilters, protocols],
  )

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        onClick={() => {
          handleProtocolSelect(SushiSwapProtocol.SUSHISWAP_V2)
        }}
        variant={'outline'}
        className={classNames(
          'rounded-xl border-dashed  hover:!bg-[#F338C31A] hover:text-[#F338C3] hover:dark:!bg-[#F338C31A]',
          protocols.includes(SushiSwapProtocol.SUSHISWAP_V2) &&
            protocols.length === 1
            ? '!bg-[#F338C31A] dark:!bg-[#F338C31A] !border-[#F338C3] dark:!border-[#F338C3] text-[#F338C3] !border-solid'
            : '!bg-slate-200 dark:!bg-slate-750',
        )}
        size="sm"
      >
        V2
      </Button>
      <Button
        onClick={() => {
          handleProtocolSelect(SushiSwapProtocol.SUSHISWAP_V3)
        }}
        variant={'outline'}
        className={classNames(
          'rounded-xl border-dashed  hover:!bg-[#3B7EF61A] hover:text-[#3B7EF6] hover:dark:!bg-[#3B7EF61A]',
          protocols.includes(SushiSwapProtocol.SUSHISWAP_V3) &&
            protocols.length === 1
            ? '!bg-[#3B7EF61A] dark:!bg-[#3B7EF61A] !border-[#3B7EF6] dark:!border-[#3B7EF6] text-[#3B7EF6] !border-solid'
            : '!bg-slate-200 dark:!bg-slate-750',
        )}
        size="sm"
      >
        V3
      </Button>
    </div>
  )
}
