'use client'

import {
  type Row,
  type SortingState,
  type TableMeta,
  type TableOptions,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { Fragment, type ReactNode, useMemo, useRef } from 'react'
import { useTableVirtualizer } from '../data-table/use-table-virtualizer'
import { MobileCard } from './mobile-card'
import { MobileCardSkeleton } from './mobile-card-skeleton'
import { MobileTableRowAction } from './mobile-table-row-action'

export interface MobileTableProps<T> {
  columns: TableOptions<T>['columns']
  data: T[]
  isLoading: boolean
  meta?: TableMeta<T>
  sorting: SortingState
  /** Rows from a table over the same data, ordered before desktop pagination. */
  orderedRows?: Row<T>[]
  isExpandedOverride?: boolean
  scrollClassName?: string
  scrollMode?: 'element' | 'window'
  linkFormatter?: (value: T) => string
  onRowClick?: (value: T) => void
  getRowLabel?: (value: T) => string
  /** A custom renderer owns the row content and its interactions. */
  rowRenderer?: (row: Row<T>, content: ReactNode) => ReactNode
  skeleton?: ReactNode
  footer?: ReactNode
  hideExpand?: boolean
}

export function MobileTable<T>({
  columns,
  data,
  isLoading,
  meta,
  sorting,
  orderedRows,
  isExpandedOverride,
  scrollClassName,
  scrollMode = 'element',
  linkFormatter,
  onRowClick,
  getRowLabel,
  rowRenderer,
  skeleton,
  footer,
  hideExpand,
}: MobileTableProps<T>): ReactNode {
  const table = useReactTable({
    data: data,
    columns: columns,
    meta,
    state: {
      sorting,
    },
    manualSorting: orderedRows !== undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const headers = table.getFlatHeaders()
  const headersById = useMemo(() => {
    return Object.fromEntries(
      headers.map((header) => [header.column.id, header]),
    )
  }, [headers])

  const rowModel = table.getRowModel()
  const rows = useMemo(
    () => orderedRows?.map((row) => rowModel.rows[row.index]) ?? rowModel.rows,
    [orderedRows, rowModel],
  )

  const parentRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { virtualizer, scrollMargin } = useTableVirtualizer({
    containerRef: parentRef,
    listRef,
    scrollMode,
    loading: isLoading,
    count: rows.length,
    estimateSize: isExpandedOverride ? 230 : 80,
    overscan: 20,
    getItemKey: (index) => rows[index].id,
  })

  function renderRow(row: Row<T>): ReactNode {
    const content = (
      <MobileCard
        row={row}
        isExpandedOverride={isExpandedOverride}
        headers={headersById}
        hideExpand={hideExpand}
      />
    )
    if (rowRenderer) return rowRenderer(row, content)
    if (!linkFormatter && !onRowClick) return content
    return (
      <MobileTableRowAction
        href={linkFormatter?.(row.original)}
        label={getRowLabel?.(row.original)}
        onClick={onRowClick && (() => onRowClick(row.original))}
      >
        {content}
      </MobileTableRowAction>
    )
  }

  if (isLoading) {
    if (skeleton) return skeleton
    return (
      <div className="flex flex-col gap-3">
        <MobileCardSkeleton />
        <MobileCardSkeleton />
        <MobileCardSkeleton />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border text-xs border-accent bg-secondary p-4 flex gap-2 justify-center">
          No results.
        </div>
      </div>
    )
  }

  if (scrollClassName || scrollMode === 'window') {
    return (
      <div
        className={classNames(scrollClassName, 'min-h-[300px]')}
        ref={parentRef}
      >
        <div
          ref={listRef}
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]

            return (
              <div
                className="absolute left-0 top-0 w-full pb-3"
                data-index={virtualRow.index}
                key={row.id}
                ref={virtualizer.measureElement}
                style={{
                  transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                }}
              >
                {renderRow(row)}
              </div>
            )
          })}
        </div>
        {footer}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 min-h-[300px]" ref={parentRef}>
      {virtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return <Fragment key={row.id}>{renderRow(row)}</Fragment>
      })}
      {footer}
    </div>
  )
}
