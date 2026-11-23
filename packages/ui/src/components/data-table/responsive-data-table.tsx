'use client'

import type {
  OnChangeFn,
  SortingState,
  TableMeta,
  TableOptions,
  TableState,
} from '@tanstack/react-table'
import type { ReactElement } from 'react'
import {
  MobileTable,
  type MobileTableProps,
} from '../mobile-table/mobile-table'
import {
  type DataTableVirtualProps,
  DataTableVirtualView,
  useVirtualDataTable,
} from './data-table-virtual'

const breakpointClasses = {
  md: { desktop: 'hidden md:block', mobile: 'md:hidden' },
  lg: { desktop: 'hidden lg:block', mobile: 'lg:hidden' },
}

export interface ResponsiveDataTableProps<TData> {
  data: TData[]
  /** Desktop columns define sorting for both layouts, including fields omitted from cards. */
  columns: TableOptions<TData>['columns']
  loading: boolean
  /** Shared row destination. Each layout can override it for custom navigation. */
  linkFormatter?: (value: TData) => string
  meta?: TableMeta<TData>
  /** Minimum width for the desktop table. */
  breakpoint?: keyof typeof breakpointClasses
  scrollMode?: 'element' | 'window'
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  /** Set when the supplied data is already sorted, e.g. by an API. */
  manualSorting?: boolean
  desktop?: Omit<
    DataTableVirtualProps<TData, unknown>,
    | 'columns'
    | 'data'
    | 'loading'
    | 'meta'
    | 'manualSorting'
    | 'onSortingChange'
    | 'state'
  > & {
    state?: Partial<Pick<TableState, 'columnVisibility' | 'pagination'>>
  }
  mobile?: Partial<
    Omit<
      MobileTableProps<TData>,
      'data' | 'isLoading' | 'meta' | 'sorting' | 'orderedRows'
    >
  >
}

/** Shares the rows and sorting between a virtual desktop table and mobile cards. */
export function ResponsiveDataTable<TData>({
  data,
  columns,
  loading,
  linkFormatter,
  meta,
  breakpoint = 'lg',
  scrollMode = 'window',
  sorting,
  onSortingChange,
  manualSorting,
  desktop,
  mobile,
}: ResponsiveDataTableProps<TData>): ReactElement {
  const desktopProps = {
    columns,
    linkFormatter,
    scrollMode,
    ...desktop,
    data,
    loading,
    meta,
    manualSorting,
    onSortingChange,
    state: {
      ...desktop?.state,
      sorting,
      pagination:
        desktop?.state?.pagination ??
        (desktop?.pagination
          ? undefined
          : { pageIndex: 0, pageSize: Math.max(data.length, 1) }),
    },
  }
  const table = useVirtualDataTable(desktopProps)

  return (
    <>
      <div className={breakpointClasses[breakpoint].desktop}>
        <DataTableVirtualView {...desktopProps} table={table} />
      </div>
      <div className={breakpointClasses[breakpoint].mobile}>
        <MobileTable
          columns={columns}
          linkFormatter={linkFormatter}
          scrollMode={scrollMode}
          {...mobile}
          data={data}
          isLoading={loading}
          meta={meta}
          sorting={table.getState().sorting}
          orderedRows={table.getPrePaginationRowModel().rows}
        />
      </div>
    </>
  )
}
