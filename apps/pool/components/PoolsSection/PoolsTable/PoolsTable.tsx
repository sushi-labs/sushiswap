import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { classNames, Table } from '@sushiswap/ui'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Pair } from '../../../.graphclient'
import { PAGE_SIZE, POOL_TABLE_COLUMNS } from './contants'

const fetcher = ({ url, args }: { url: string; args: { sorting: SortingState; pagination: PaginationState } }) => {
  const _url = new URL(url)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))
}

export const PoolsTable: FC = () => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'reserveETH', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])
  const { data: pools } = useSWR<Pair[]>(
    { url: `${typeof window !== 'undefined' ? window.location : ''}/api/pools`, args },
    fetcher
  )

  const table = useReactTable({
    data: pools ?? [],
    columns: POOL_TABLE_COLUMNS,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
    manualPagination: true,
  })

  return (
    <Table.container>
      <Table.table>
        <Table.thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.thr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ maxWidth: header.column.getSize(), width: header.column.getSize() }}
                >
                  <div
                    {...{
                      className: classNames(
                        header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        'h-full flex items-center gap-2'
                      ),
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowUpIcon width={14} height={14} />,
                      desc: <ArrowDownIcon width={14} height={14} />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </Table.th>
              ))}
            </Table.thr>
          ))}
        </Table.thead>
        <Table.tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Table.tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return <Table.td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.td>
                })}
              </Table.tr>
            )
          })}
          {table.getRowModel().rows.length === 0 &&
            Array.from(Array(PAGE_SIZE)).map((el, index) => (
              <Table.tr key={index} className="!max-h-[48px]">
                <Table.td style={{ maxWidth: POOL_TABLE_COLUMNS[0].size, width: POOL_TABLE_COLUMNS[0].size }}>
                  <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                </Table.td>
                <Table.td
                  className="flex gap-2 items-center"
                  style={{ maxWidth: POOL_TABLE_COLUMNS[1].size, width: POOL_TABLE_COLUMNS[1].size }}
                >
                  <div className="flex items-center">
                    <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                    <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                  </div>
                </Table.td>
                <Table.td style={{ maxWidth: POOL_TABLE_COLUMNS[2].size, width: POOL_TABLE_COLUMNS[2].size }}>
                  <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                </Table.td>
                <Table.td style={{ maxWidth: POOL_TABLE_COLUMNS[3].size, width: POOL_TABLE_COLUMNS[3].size }}>
                  <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                </Table.td>
                <Table.td
                  className="flex items-center"
                  style={{ maxWidth: POOL_TABLE_COLUMNS[4].size, width: POOL_TABLE_COLUMNS[4].size }}
                >
                  <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                  <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
                </Table.td>
              </Table.tr>
            ))}
        </Table.tbody>
      </Table.table>
    </Table.container>
  )
}
