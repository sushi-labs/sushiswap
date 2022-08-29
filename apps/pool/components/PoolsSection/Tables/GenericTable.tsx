import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { classNames, Link, LoadingOverlay, Table, Tooltip, Typography } from '@sushiswap/ui'
import { flexRender, Table as ReactTableType } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'

import { ExtendedColumnDef } from './types'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  columns: ExtendedColumnDef<C, unknown>[]
  HoverElement?: React.FunctionComponent<{ row: C }>
  loading?: boolean
  placeholder: ReactNode
}

export const GenericTable = <T extends { id: string }>({
  table,
  columns,
  HoverElement,
  loading,
  placeholder,
}: GenericTableProps<T>) => {
  const router = useRouter()
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      <LoadingOverlay show={showOverlay} />
      <Table.container>
        <Table.table className="min-h-[312px]">
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
            {!loading &&
              table.getRowModel().rows.map((row) => {
                if (HoverElement) {
                  return (
                    <Tooltip
                      key={row.id}
                      trigger="hover"
                      mouseEnterDelay={0.5}
                      placement="top"
                      button={
                        <Table.tr
                          onClick={(e) => {
                            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                              setShowOverlay(true)
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Table.td style={{ maxWidth: columns[0].size, width: columns[0].size }} key={cell.id}>
                                <Link.Internal href={`/${row.original.id}`} passHref={true}>
                                  <a>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </a>
                                </Link.Internal>
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
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                        setShowOverlay(true)
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.td style={{ maxWidth: columns[0].size, width: columns[0].size }} key={cell.id}>
                          <Link.Internal href={`/${row.original.id}`} passHref={true}>
                            <a>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </a>
                          </Link.Internal>
                        </Table.td>
                      )
                    })}
                  </Table.tr>
                )
              })}
            {loading &&
              Array.from(Array(5)).map((el, index) => (
                <Table.tr key={index}>
                  {columns.map((column) => (
                    <Table.td key={column.id} style={{ maxWidth: column.size, width: column.size }}>
                      {column.skeleton}
                    </Table.td>
                  ))}
                </Table.tr>
              ))}
            {!loading && table.getRowModel().rows.length === 0 && (
              <Table.tr className="!h-[260px]">
                <Table.td colSpan={table.getAllColumns().length} className="!h-[260px]">
                  <Typography variant="xs" className="text-slate-400 italic w-full text-center">
                    {placeholder}
                  </Typography>
                </Table.td>
              </Table.tr>
            )}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}
