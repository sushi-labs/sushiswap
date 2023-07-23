'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  SortingState,
  type Table as TableType,
  TableState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { default as React, ReactNode } from 'react'

import { Table, TableBody, TableCell, TableCellAsLink, TableHead, TableHeader, TableRow } from '../tablenew'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTablePagination } from './data-table-pagination'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    skeleton?: React.ReactNode
  }
}

interface DataTableProps<TData, TValue> {
  testId?: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  toolbar?: (table: TableType<TData>) => ReactNode
  pagination?: boolean
  loading: boolean
  linkFormatter?: (value: TData) => string
  state?: Partial<TableState>
  onSortingChange?: OnChangeFn<SortingState>
  onPaginationChange?: OnChangeFn<PaginationState>
  rowRenderer?: (row: Row<TData>, value: ReactNode) => ReactNode
}

export function DataTable<TData, TValue>({
  testId,
  columns,
  data,
  toolbar,
  pagination = false,
  loading,
  linkFormatter,
  state,
  onSortingChange,
  onPaginationChange,
  rowRenderer,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      sorting: state?.sorting ? state.sorting : sorting,
      ...(state?.pagination && { pagination: state?.pagination }),
    },
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
    <div className="space-y-4">
      {toolbar ? toolbar(table) : null}
      <div className="border border-accent rounded-xl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={header.column.getCanSort() ? 'px-2' : 'px-4'}>
                      {header.isPlaceholder ? null : (
                        <DataTableColumnHeader
                          column={header.column}
                          title={header.column.columnDef.header as string}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 })
                .fill(null)
                .map((_, i) => (
                  <TableRow key={i}>
                    {table.getVisibleFlatColumns().map((cell) => {
                      return <TableCell key={cell.id}>{cell.columnDef.meta?.skeleton}</TableCell>
                    })}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, r) => {
                const _row = (
                  <TableRow data-state={row.getIsSelected() && 'selected'} testdata-id={`${testId}-${r}-tr`}>
                    {row.getVisibleCells().map((cell, i) =>
                      linkFormatter ? (
                        <TableCellAsLink
                          href={linkFormatter(row.original)}
                          key={cell.id}
                          testdata-id={`${testId}-${r}-${i}-td`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCellAsLink>
                      ) : (
                        <TableCell testdata-id={`${testId}-${r}-${i}-td`} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                )

                if (rowRenderer) return rowRenderer(row, _row)
                return _row
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination ? <DataTablePagination table={table} /> : null}
    </div>
  )
}
