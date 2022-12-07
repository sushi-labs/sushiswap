import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { classNames, Link, LoadingOverlay, Table, Tooltip, Typography } from '@sushiswap/ui'
import { ColumnDef, flexRender, RowData, Table as ReactTableType } from '@tanstack/react-table'
import React, { ReactNode, useState } from 'react'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  columns: ColumnDef<C>[]
  HoverElement?: React.FunctionComponent<{ row: C }>
  loading?: boolean
  placeholder: ReactNode
  pageSize: number
  linkFormatter?(path: string): string
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    skeleton: ReactNode
  }
}

export const GenericTable = <T extends { id: string }>({
  table,
  HoverElement,
  loading,
  placeholder,
  pageSize,
}: GenericTableProps<T>) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [popupInvisible, setPopupInvisible] = useState(false)

  const headers = table.getFlatHeaders()

  return (
    <>
      {/* <LoadingOverlay show={showOverlay} /> */}
      <Table.container>
        <Table.table style={{ minHeight: (pageSize + 1) * 52 }}>
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
                          header.column.columnDef?.meta?.className,
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
                      {...(popupInvisible && { popupVisible: false })}
                      destroyTooltipOnHide={true}
                      key={row.id}
                      trigger="hover"
                      mouseEnterDelay={0.5}
                      placement="top"
                      button={
                        <Table.tr
                          onClick={(e) => {
                            // if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                            //   setPopupInvisible(true)
                            //   setTimeout(() => setShowOverlay(true), 250)
                            // }
                          }}
                          className="cursor-pointer"
                        >
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <Table.td
                                className="!px-0 relative"
                                style={{ maxWidth: headers[i].getSize(), width: headers[i].getSize() }}
                                key={cell.id}
                              >
                                {/* <Link.Internal href={linkFormatter ? linkFormatter(row.original.id) : ``} passHref={true}> */}
                                  <p
                                    className={classNames(
                                      'absolute inset-0 flex items-center px-3 sm:px-4',
                                      cell.column.columnDef.meta?.className
                                    )}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </p>
                                {/* </Link.Internal> */}
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
                      // if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
                      //   setShowOverlay(true)
                      // }
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell, i) => {
                      return (
                        <Table.td
                          className="!px-0 relative"
                          style={{ maxWidth: headers[i].getSize(), width: headers[i].getSize() }}
                          key={cell.id}
                        >
                          {/* <Link.Internal href={linkFormatter ? linkFormatter(row.original.id) : ``} passHref={true}> */}
                            <p
                              className={classNames(
                                'absolute inset-0 flex items-center px-3 sm:px-4',
                                cell.column.columnDef.meta?.className
                              )}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </p>
                          {/* </Link.Internal> */}
                        </Table.td>
                      )
                    })}
                  </Table.tr>
                )
              })}
            {!loading &&
              table.getRowModel().rows.length !== 0 &&
              Array.from(Array(Math.max(pageSize - table.getRowModel().rows.length, 0))).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map((column) => (
                    <Table.td key={column.id} style={{ maxWidth: column.getSize(), width: column.getSize() }} />
                  ))}
                </Table.tr>
              ))}
            {loading &&
              Array.from(Array(pageSize)).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map((column) => {
                    return (
                      <Table.td key={column.id} style={{ maxWidth: column.getSize(), width: column.getSize() }}>
                        {column.columnDef.meta?.skeleton}
                      </Table.td>
                    )
                  })}
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
