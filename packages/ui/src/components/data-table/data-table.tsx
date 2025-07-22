'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type SortingState,
  type TableState,
  type Table as TableType,
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
import { default as React, type ReactNode } from 'react'

import classNames from 'classnames'
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
import { DataTablePagination } from './data-table-pagination'

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  interface ColumnMeta<TData extends RowData, TValue> {
    body?: {
      className?: string
      skeleton?: React.ReactNode
    }
    header?: {
      className?: string
      description?: string
    }
    tableHead?: {
      className?: string
    }
    disableLink?: boolean
  }
}

interface DataTableProps<TData, TValue> {
  testId?: string | ((value: TData, index: number) => string)
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: TableType<TData>) => ReactNode
  pagination?: boolean
  loading: boolean
  linkFormatter?: (value: TData) => string
  externalLink?: boolean
  state?: Partial<TableState>
  onSortingChange?: OnChangeFn<SortingState>
  onPaginationChange?: OnChangeFn<PaginationState>
  rowRenderer?: (row: Row<TData>, value: ReactNode) => ReactNode
  showColumnHeaders?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  testId,
  columns,
  data,
  toolbar,
  pagination = false,
  loading,
  linkFormatter,
  externalLink = false,
  state,
  onSortingChange,
  onPaginationChange,
  rowRenderer,
  showColumnHeaders = true,
  className,
}: DataTableProps<TData, TValue>) {
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

  return (
    <div
      className={classNames(
        'space-y-4 border-t rounded-xl border-secondary black:border-white/[0.1]',
        className,
      )}
    >
      {toolbar ? toolbar(table) : null}
      <Table
        className={classNames(
          pagination
            ? 'border-b border-secondary  black:border-white/[0.1]'
            : '',
          'dark:bg-slate-800 bg-slate-50 rounded-xl',
        )}
      >
        {showColumnHeaders ? (
          <TableHeader className="pb-4 pt-8">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{ width: header.getSize() }}
                      key={header.id}
                      className={classNames(
                        header.column.getCanSort() ? 'px-2' : 'px-4',
                        header.column.columnDef.meta?.tableHead?.className,
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
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, r) => {
              const _row = (
                <TableRow
                  key={r}
                  data-state={row.getIsSelected() && 'selected'}
                  testdata-id={
                    typeof testId === 'function'
                      ? testId(row.original, r)
                      : `${testId}-${r}-tr`
                  }
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
      {pagination ? (
        <div className="px-6 pb-6">
          <DataTablePagination table={table} />
        </div>
      ) : null}
    </div>
  )
}
