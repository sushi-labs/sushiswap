import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from '@sushiswap/wagmi'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { NAME_COLUMN_V3, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL, PRICE_RANGE_COLUMN } from './Cells/columns'
import { ConcentratedLiquidityPosition, useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Disclosure } from '@headlessui/react'
import { classNames, Collapsible } from '@sushiswap/ui'
import ConcentratedCurveIcon from '@sushiswap/ui/future/components/icons/ConcentratedCurveIcon'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NAME_COLUMN_V3, PRICE_RANGE_COLUMN, POSITION_SIZE_CELL, POSITION_UNCLAIMED_CELL]

export const ConcentratedPositionsTable: FC<{ variant?: 'default' | 'minimal' }> = ({ variant = 'default' }) => {
  const [hide, setHide] = useState(false)
  const { chainIds } = usePoolFilters()
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  // const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: positions, isLoading } = useConcentratedLiquidityPositions({ account: address, chainIds })

  const _positions = useMemo(() => {
    return positions?.filter((el) => (hide ? !el.liquidity?.eq('0') : true))
  }, [hide, positions])

  const table = useReactTable<ConcentratedLiquidityPosition>({
    data: _positions || [],
    state: {
      // sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({})
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        positionSize: false,
        unclaimed: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: ConcentratedLiquidityPosition) => {
    return `/position/${row.chainId}:${row.tokenId}`
  }, [])

  if (variant === 'minimal') {
    return (
      <GenericTable<ConcentratedLiquidityPosition>
        table={table}
        loading={isLoading}
        placeholder="No positions found"
        pageSize={!_positions ? 5 : _positions?.length}
        linkFormatter={rowLink}
        loadingOverlay={false}
      />
    )
  }

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          <Disclosure.Button as="div" role="button" className="flex justify-end gap-2">
            <div className={classNames(open ? '' : '', 'w-full group')}>
              <h1 className="flex gap-2 items-center justify-between font-semibold text-sm text-gray-700 group-hover:text-gray-900 dark:text-slate-200 dark:group-hover:text-slate-50 py-4 px-4">
                <span className="flex items-center gap-3">
                  <ConcentratedCurveIcon width={20} height={20} className="saturate-200" /> Concentrated Liquidity
                  Positions {positions ? `(${positions.length})` : ''}
                </span>
                <div className="flex gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setHide((prev) => !prev)
                    }}
                    className="text-blue group-hover:text-blue-600 text-sm"
                  >
                    {hide ? 'Show closed positions' : 'Hide closed positions'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="text-blue group-hover:text-blue-600 text-sm">
                      {open ? 'Collapse' : 'Expand'}
                    </button>
                    <ChevronDownIcon
                      width={24}
                      height={24}
                      className={classNames(
                        'transition-all',
                        open ? 'rotate-180' : 'rotate-0',
                        'text-blue group-hover:text-blue-600'
                      )}
                    />
                  </div>
                </div>
              </h1>
            </div>
          </Disclosure.Button>
          <Collapsible open={open}>
            <GenericTable<ConcentratedLiquidityPosition>
              table={table}
              loading={isLoading}
              placeholder="No positions found"
              pageSize={!_positions ? 5 : _positions?.length}
              linkFormatter={rowLink}
              loadingOverlay={false}
            />
          </Collapsible>
        </>
      )}
    </Disclosure>
  )
}
