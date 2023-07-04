import { Protocol } from '@sushiswap/database'
import { useBreakpoint } from '@sushiswap/hooks'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import { useAccount } from '@sushiswap/wagmi'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useUserPositions } from 'lib/hooks'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { PositionWithPool } from 'types'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { APR_COLUMN, NAME_COLUMN, VALUE_COLUMN } from './Cells/columns'
import { PositionQuickHoverTooltip } from './PositionQuickHoverTooltip'

const COLUMNS = [NAME_COLUMN, VALUE_COLUMN, APR_COLUMN] as any

interface PositionsTableProps {
  protocol: Protocol
}

export const PositionsTable: FC<PositionsTableProps> = ({ protocol }) => {
  const { address } = useAccount()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { chainIds, tokenSymbols } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'value', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: positions, isValidating } = useUserPositions({ id: address, chainIds: SUPPORTED_CHAIN_IDS })

  const _positions = useMemo(() => {
    if (!positions) return []

    const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
    const searchFiltered = positions.filter((el) =>
      _tokenSymbols.length > 0
        ? _tokenSymbols.some((symbol) => {
            return [el.pool?.token0.symbol, el.pool?.token1.symbol].includes(symbol.toUpperCase())
          })
        : true
    )
    const chainFiltered = searchFiltered.filter((el) => chainIds.includes(el.chainId))
    const protocolFiltered = chainFiltered.filter((el) => el.pool?.protocol === protocol)

    return protocolFiltered
  }, [positions, tokenSymbols, chainIds, protocol])

  const table = useReactTable<PositionWithPool>({
    data: _positions,
    state: {
      sorting,
      columnVisibility,
    },
    columns: COLUMNS,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({
        volume: false,
        apr: false,
        liquidityUSD: false,
      })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: PositionWithPool) => {
    return `/pool/${row.pool.id}`
  }, [])

  return (
    <div className="mb-[120px]">
      <GenericTable<PositionWithPool>
        table={table}
        HoverElement={isMd ? PositionQuickHoverTooltip : undefined}
        loading={isValidating}
        placeholder="No positions found"
        pageSize={_positions?.length ? _positions.length : 1}
        linkFormatter={rowLink}
      />
    </div>
  )
}
