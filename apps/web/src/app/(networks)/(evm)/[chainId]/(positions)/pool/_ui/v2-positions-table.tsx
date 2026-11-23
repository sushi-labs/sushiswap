'use client'

import type { V2Position } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTableSortMenu,
  ResponsiveDataTable,
  Slot,
} from '@sushiswap/ui'
import type { DisplayColumnDef, Row, SortingState } from '@tanstack/react-table'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useSushiV2UserPositions } from 'src/lib/hooks/api/use-sushi-v2-user-positions'
import type { SushiSwapV2ChainId } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { APR_COLUMN, NAME_COLUMN_POOL, VALUE_COLUMN } from './columns'

const COLUMNS = [
  NAME_COLUMN_POOL,
  VALUE_COLUMN,
  APR_COLUMN,
] as DisplayColumnDef<V2Position, unknown>[]

const MOBILE_COLUMNS = [
  COLUMNS[0],
  { id: 'blank-1', header: () => null, cell: () => null },
  { id: 'blank-2', header: () => null, cell: () => null },
  COLUMNS[1],
  COLUMNS[2],
]

const SORT_OPTIONS = [
  { id: 'value', label: 'Value' },
  { id: 'totalApr1d', label: 'APR' },
]

interface PositionsTableProps {
  chainId: SushiSwapV2ChainId
  onRowClick?(row: V2Position): void
  rowLink?(row: V2Position): string
}

export function V2PositionsTable({
  chainId,
  onRowClick,
  rowLink,
}: PositionsTableProps): ReactNode {
  const { address } = useConnection()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'value', desc: true },
  ])

  const { data: positions, isLoading } = useSushiV2UserPositions({
    user: address,
    chainId,
  })

  const _positions = useMemo(() => {
    if (!positions) return []
    return positions
  }, [positions])

  const rowRenderer = useCallback(
    (row: Row<V2Position>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  return (
    <Card className="!bg-transparent md:!bg-secondary !border-transparent md:!border-accent">
      <CardHeader className="!px-0 !pt-3 md:!pt-6 md:!px-6">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="shrink-0">
            My Positions{' '}
            <span className="text-muted-foreground text-sm font-normal">
              ({positions?.length ?? 0})
            </span>
          </CardTitle>
          <DataTableSortMenu
            label="positions"
            options={SORT_OPTIONS}
            sorting={sorting}
            onSortingChange={setSorting}
            className="md:hidden"
          />
        </div>
      </CardHeader>
      <ResponsiveDataTable
        breakpoint="md"
        scrollMode="element"
        columns={COLUMNS}
        data={_positions}
        loading={isLoading}
        sorting={sorting}
        onSortingChange={setSorting}
        linkFormatter={rowLink}
        desktop={{
          rowRenderer,
          trClassName: 'h-[72px]',
          estimateSize: 72,
        }}
        mobile={{
          columns: MOBILE_COLUMNS,
          isExpandedOverride: true,
          hideExpand: true,
          getRowLabel: (position) => `View ${position.pool.name} position`,
          onRowClick,
        }}
      />
    </Card>
  )
}
