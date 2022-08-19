import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { classNames, LoadingOverlay, Table, Tooltip } from '@sushiswap/ui'
import { flexRender, Row, Table as ReactTableType } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { PAGE_SIZE } from './constants'
import { ExtendedColumnDef } from './types'

interface GenericTableProps<T> {
  variant?: 'default' | 'popover'
  size?: 'default' | 'lg'
  table: ReactTableType<T>
  columns: ExtendedColumnDef<T, unknown>[]
  onClick(row: Row<T>): void
  HoverElement?: React.FunctionComponent<{ row: T }>
}

export const GenericTable = <T extends { id: string }>({
  table,
  columns,
  onClick,
  HoverElement,
  variant = 'default',
  size = 'default',
}: GenericTableProps<T>) => {
  const router = useRouter()
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <LoadingOverlay show={showOverlay} />
      <Table.container>
        <Table.table className={variant === 'popover' ? '!rounded-none bg-slate-900' : ''}>
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
                          variant === 'popover' ? 'text-xs' : '',
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
                    naked
                    key={row.id}
                    trigger="hover"
                    mouseEnterDelay={0.5}
                    placement="top"
                    button={
                      <Table.tr
                        size={size}
                        onClick={() => {
                          setShowOverlay(true)
                          onClick(row)
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
                  size={size}
                  key={row.id}
                  onClick={() => {
                    setShowOverlay(true)
                    onClick(row)
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
              Array.from(Array(variant === 'popover' ? 3 : PAGE_SIZE)).map((el, index) => (
                <Table.tr key={index} size={size}>
                  {columns.map((column) => (
                    <Table.td key={column.id} style={{ maxWidth: column.size, width: column.size }}>
                      {column.skeleton}
                    </Table.td>
                  ))}
                </Table.tr>
              ))}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}
