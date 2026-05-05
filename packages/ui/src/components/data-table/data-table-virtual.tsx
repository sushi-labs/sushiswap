'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type SortingState,
  type TableMeta,
  type TableState,
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
import { useVirtualizer } from '@tanstack/react-virtual'
import classNames from 'classnames'
import { default as React, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableCellAsLink,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import { DataTableColumnHeader } from './data-table-column-header'

interface DataTableVirtualProps<TData, TValue> {
  testId?: string | ((value: TData, index: number) => string)
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  linkFormatter?: (value: TData) => string
  externalLink?: boolean
  state?: Partial<TableState>
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
}

export function DataTableVirtual<TData, TValue>({
  testId,
  columns,
  data,
  loading,
  linkFormatter,
  externalLink = false,
  state,
  onSortingChange,
  onPaginationChange,
  rowRenderer,
  showColumnHeaders = true,
  meta,
  thClassName,
  hideScrollbar = false,
  overscan = 20,
  estimateSize = 30,
  trClassName,
}: DataTableVirtualProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility: state?.columnVisibility
        ? state.columnVisibility
        : columnVisibility,
      sorting: state?.sorting ? state.sorting : sorting,
      ...(state?.pagination && { pagination: state?.pagination }),
    },
    meta,
    autoResetPageIndex: false,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: onSortingChange ? onSortingChange : setSorting,
    onPaginationChange: onPaginationChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const { rows } = table.getRowModel()

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    enabled: true,
  })

  return (
    <div
      ref={parentRef}
      className={classNames(
        'space-y-4 border-t border-secondary black:border-white/[0.1] overflow-auto',
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

        <TableBody>
          {loading ? (
            Array.from({ length: 3 })
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
          ) : virtualizer.getVirtualItems()?.length ? (
            virtualizer.getVirtualItems().map((virtualRow, r) => {
              const row = rows[virtualRow.index]
              const _row = (
                <TableRow
                  key={r}
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
                      <TableCellAsLink
                        style={{ width: cell.column.getSize() }}
                        href={linkFormatter(row.original)}
                        external={externalLink}
                        key={cell.id}
                        className={cell.column.columnDef.meta?.body?.className}
                        testdata-id={`${testId}-${r}-${i}-td`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCellAsLink>
                    ) : (
                      <TableCell
                        style={{ width: cell.column.getSize() }}
                        testdata-id={`${testId}-${r}-${i}-td`}
                        key={cell.id}
                        className={cell.column.columnDef.meta?.body?.className}
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
            })
          ) : (
            <TableRow>
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
    </div>
  )
}
