'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Table as ReactTable,
  type Row,
  type SortingState,
  type TableMeta,
  type TableState,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import Link from 'next/link'
import { default as React, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableVirtualPagination } from './data-table-virtual-pagination'
import { useTableVirtualizer } from './use-table-virtualizer'

export interface DataTableVirtualProps<TData, TValue> {
  scrollMode?: 'element' | 'window'
  scrollClassName?: string
  footer?: ReactNode
  testId?: string | ((value: TData, index: number) => string)
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  linkFormatter?: (value: TData) => string
  externalLink?: boolean
  state?: Partial<TableState>
  manualSorting?: boolean
  onSortingChange?: OnChangeFn<SortingState>
  onPaginationChange?: OnChangeFn<PaginationState>
  rowRenderer?: (row: Row<TData>, value: ReactNode) => ReactNode
  showColumnHeaders?: boolean
  meta?: TableMeta<TData>
  thClassName?: string
  hideScrollbar?: boolean
  overscan?: number
  estimateSize?: number
  trClassName?: string
  pagination?: boolean
  skeletonRowCount?: number
}

export function useVirtualDataTable<TData, TValue>({
  columns,
  data,
  state,
  manualSorting,
  onSortingChange,
  onPaginationChange,
  meta,
}: DataTableVirtualProps<TData, TValue>): ReactTable<TData> {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  function handleSortingChange(updater: Updater<SortingState>): void {
    if (state?.sorting === undefined) setSorting(updater)
    onSortingChange?.(updater)
  }

  return useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility: state?.columnVisibility
        ? state.columnVisibility
        : columnVisibility,
      sorting: state?.sorting ?? sorting,
      ...(state?.pagination && { pagination: state?.pagination }),
    },
    meta,
    manualSorting,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    ...(onPaginationChange && { onPaginationChange }),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
}

export function DataTableVirtual<TData, TValue>(
  props: DataTableVirtualProps<TData, TValue>,
): React.ReactElement {
  const table = useVirtualDataTable(props)
  return <DataTableVirtualView {...props} table={table} />
}

export function DataTableVirtualView<TData, TValue>({
  table,
  scrollMode = 'element',
  scrollClassName,
  footer,
  testId,
  columns,
  loading,
  linkFormatter,
  externalLink = false,
  rowRenderer,
  showColumnHeaders = true,
  thClassName,
  hideScrollbar = false,
  overscan = 20,
  estimateSize = 30,
  trClassName,
  pagination = false,
  skeletonRowCount = 3,
}: DataTableVirtualProps<TData, TValue> & {
  table: ReactTable<TData>
}): React.ReactElement {
  const { rows } = table.getRowModel()

  const parentRef = React.useRef<HTMLDivElement>(null)
  const bodyRef = React.useRef<HTMLTableSectionElement>(null)

  const { virtualizer, scrollMargin } = useTableVirtualizer({
    containerRef: parentRef,
    listRef: bodyRef,
    scrollMode,
    loading,
    count: rows.length,
    estimateSize,
    overscan,
    getItemKey: (index) => rows[index].id,
  })
  const virtualRows = virtualizer.getVirtualItems()
  const hasScrollContainer = Boolean(scrollClassName) || scrollMode === 'window'
  const paddingTop = hasScrollContainer
    ? Math.max(0, (virtualRows[0]?.start ?? scrollMargin) - scrollMargin)
    : 0
  const paddingBottom = hasScrollContainer
    ? virtualizer.getTotalSize() -
      ((virtualRows[virtualRows.length - 1]?.end ?? scrollMargin) -
        scrollMargin)
    : 0

  return (
    <div
      ref={parentRef}
      className={classNames(
        'space-y-4 border-t border-secondary black:border-white/[0.1]',
        scrollMode === 'element' ? 'overflow-auto' : '',
        scrollClassName,
        hideScrollbar ? 'hide-scrollbar' : '',
      )}
    >
      <Table hideScrollbar={hideScrollbar}>
        {showColumnHeaders ? (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{ width: header.getSize() }}
                      key={header.id}
                      className={classNames(
                        header.column.getCanSort() ? 'px-2' : 'px-4',
                        thClassName ?? '',
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <DataTableColumnHeader header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
        ) : null}

        <TableBody ref={bodyRef}>
          {loading ? (
            Array.from({ length: skeletonRowCount })
              .fill(null)
              .map((_, i) => (
                <TableRow key={i} testdata-id="table-rows-loading">
                  {table.getVisibleFlatColumns().map((column, _i) => {
                    return (
                      <TableCell
                        style={{ width: column.getSize() }}
                        key={column.id}
                        className={column.columnDef.meta?.body?.className}
                      >
                        {column.columnDef.meta?.body?.skeleton}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
          ) : virtualRows.length ? (
            <>
              {paddingTop ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ height: paddingTop, padding: 0 }}
                  />
                </tr>
              ) : null}
              {virtualRows.map((virtualRow, r) => {
                const row = rows[virtualRow.index]
                const _row = (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={
                      hasScrollContainer
                        ? virtualizer.measureElement
                        : undefined
                    }
                    data-state={row.getIsSelected() && 'selected'}
                    testdata-id={
                      typeof testId === 'function'
                        ? testId(row.original, r)
                        : `${testId}-${r}-tr`
                    }
                    className={classNames(trClassName ?? '')}
                  >
                    {row.getVisibleCells().map((cell, i) =>
                      linkFormatter &&
                      !cell.column.columnDef.meta?.disableLink ? (
                        <td
                          className="!p-0"
                          style={{ width: cell.column.getSize() }}
                          key={cell.id}
                          testdata-id={`${testId}-${r}-${i}-td`}
                        >
                          <Link
                            scroll={false}
                            shallow={true}
                            href={linkFormatter(row.original)}
                            target={externalLink ? '_blank' : '_self'}
                            className={classNames(
                              'flex items-center text-sm font-medium p-4 align-middle [&:has([role=checkbox])]:pr-0',
                              cell.column.columnDef.meta?.body?.className,
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Link>
                        </td>
                      ) : (
                        <TableCell
                          style={{ width: cell.column.getSize() }}
                          testdata-id={`${testId}-${r}-${i}-td`}
                          key={cell.id}
                          className={
                            cell.column.columnDef.meta?.body?.className
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                )

                if (rowRenderer) return rowRenderer(row, _row)
                return _row
              })}
              {paddingBottom ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ height: paddingBottom, padding: 0 }}
                  />
                </tr>
              ) : null}
            </>
          ) : (
            <TableRow className={classNames(trClassName ?? '')}>
              <TableCell
                testdata-id="table-no-results"
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {footer}
      {pagination ? (
        <div>
          <DataTableVirtualPagination table={table} />
        </div>
      ) : null}
    </div>
  )
}
