'use client'

import type { V2Position } from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardHeader,
  CardTitle,
  DataTableSortMenu,
  DataTableVirtual,
  MobileTable,
  Slot,
} from '@sushiswap/ui'
import type {
  DisplayColumnDef,
  Row,
  SortingState,
  TableState,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { useSushiV2UserPositions } from 'src/lib/hooks/api/use-sushi-v2-user-positions'
import type { SushiSwapV2ChainId } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { APR_COLUMN, NAME_COLUMN_POOL, VALUE_COLUMN } from './columns'

// ! Column types have to be checked manually
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
  const router = useRouter()
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

  const state = useMemo<Partial<TableState>>(
    () => ({
      sorting,
      pagination: { pageIndex: 0, pageSize: Math.max(_positions.length, 1) },
    }),
    [_positions.length, sorting],
  )

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

  const mobileRowRenderer = useCallback(
    (row: Row<V2Position>, rowNode: ReactNode): ReactNode => {
      if (!rowLink && !onRowClick) return rowNode

      function navigate(): void {
        onRowClick?.(row.original)
        if (rowLink) router.push(rowLink(row.original))
      }

      return (
        <div
          role={rowLink ? 'link' : 'button'}
          tabIndex={0}
          aria-label={`View ${row.original.pool.name} position`}
          className="cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          onClick={(event) => {
            if (
              event.defaultPrevented ||
              !(event.target instanceof Element) ||
              !event.currentTarget.contains(event.target)
            ) {
              return
            }
            const interactiveTarget = event.target.closest(
              'a, button, input, select, textarea, [role="button"], [role="menuitem"], [aria-haspopup]',
            )
            if (
              interactiveTarget &&
              interactiveTarget !== event.currentTarget
            ) {
              return
            }
            navigate()
          }}
          onKeyDown={(event) => {
            if (
              (event.key === 'Enter' || (!rowLink && event.key === ' ')) &&
              event.target === event.currentTarget
            ) {
              event.preventDefault()
              navigate()
            }
          }}
        >
          {rowNode}
        </div>
      )
    },
    [onRowClick, rowLink, router],
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
      <div className="hidden md:block">
        <DataTableVirtual
          loading={isLoading}
          rowRenderer={rowRenderer}
          linkFormatter={rowLink}
          columns={COLUMNS}
          data={_positions}
          state={state}
          onSortingChange={setSorting}
          trClassName="h-[72px]"
          estimateSize={72}
        />
      </div>
      <div className="md:hidden">
        <MobileTable
          sorting={sorting}
          isLoading={isLoading}
          isExpandedOverride={true}
          hideExpand={true}
          rowRenderer={mobileRowRenderer}
          columns={MOBILE_COLUMNS}
          data={_positions}
        />
      </div>
    </Card>
  )
}
