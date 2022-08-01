import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { classNames, LoadingOverlay, Table, Tooltip } from '@sushiswap/ui'
import { ColumnDef, flexRender, Table as ReactTableType } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { PAGE_SIZE } from './contants'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  columns: ColumnDef<C>[]
  HoverElement?: React.FunctionComponent<{ row: C }>
}

export const GenericTable = <T extends { id: string }>({ table, columns, HoverElement }: GenericTableProps<T>) => {
  const router = useRouter()
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <LoadingOverlay show={showOverlay} />
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
              if (HoverElement) {
                return (
                  <Tooltip
                    key={row.id}
                    trigger="hover"
                    mouseEnterDelay={0.5}
                    placement="top"
                    button={
                      <Table.tr
                        onClick={() => {
                          setShowOverlay(true)
                          void router.push(`/${row.original.id}`)
                        }}
                        className="cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Table.td style={{ maxWidth: columns[0].size, width: columns[0].size }} key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </Table.td>
                          )
                        })}
                      </Table.tr>
                    }
                    panel={<HoverElement row={row.original} />}
                  />
                )
              }

              return (
                <Table.tr
                  key={row.id}
                  onClick={() => {
                    setShowOverlay(true)
                    void router.push(`/${row.original.id}`)
                  }}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.td style={{ maxWidth: columns[0].size, width: columns[0].size }} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.td>
                    )
                  })}
                </Table.tr>
              )
            })}
            {table.getRowModel().rows.length === 0 &&
              Array.from(Array(PAGE_SIZE)).map((el, index) => (
                <Table.tr key={index} className="!max-h-[48px]">
                  <Table.td style={{ maxWidth: columns[0].size, width: columns[0].size }}>
                    <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                  </Table.td>
                  <Table.td
                    className="flex items-center gap-2"
                    style={{ maxWidth: columns[1].size, width: columns[1].size }}
                  >
                    <div className="flex items-center">
                      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                      <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                    </div>
                  </Table.td>
                  <Table.td style={{ maxWidth: columns[2].size, width: columns[2].size }}>
                    <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                  </Table.td>
                  <Table.td style={{ maxWidth: columns[3].size, width: columns[3].size }}>
                    <div className="rounded-full bg-slate-700 w-[120px] h-[20px] animate-pulse" />
                  </Table.td>
                  <Table.td className="flex items-center" style={{ maxWidth: columns[4].size, width: columns[4].size }}>
                    <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse" />
                    <div className="rounded-full bg-slate-700 w-[26px] h-[26px] animate-pulse -ml-[12px]" />
                  </Table.td>
                </Table.tr>
              ))}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}
