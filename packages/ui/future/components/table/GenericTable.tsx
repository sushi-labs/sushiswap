import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { flexRender, RowData, Table as ReactTableType } from '@tanstack/react-table'
import React, { MouseEventHandler, ReactNode, useCallback, useState } from 'react'
import { Table } from '.'
import { Link } from '../../../link'
import { LoadingOverlay } from '../../../loader'
import { Typography } from '../../../typography'
import classNames from 'classnames'
import { Popover } from '../Popover'
import { useIsMounted } from '@sushiswap/hooks'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  HoverElement?: React.FunctionComponent<{ row: C }>
  loading?: boolean
  placeholder: ReactNode
  pageSize: number
  linkFormatter?(row: C): string
  loadingOverlay?: boolean
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    skeleton?: ReactNode
  }
}

export const GenericTable = <T extends { id: string }>({
  table,
  HoverElement,
  loading,
  placeholder,
  pageSize,
  linkFormatter,
  loadingOverlay = true,
}: GenericTableProps<T>) => {
  const isMounted = useIsMounted()
  const [showOverlay, setShowOverlay] = useState(false)
  const [, setPopupInvisible] = useState(false)

  const onClick = useCallback((e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
      setPopupInvisible(true)
      setTimeout(() => setShowOverlay(true), 250)
    }
  }, [])

  return (
    <>
      {loadingOverlay && <LoadingOverlay show={showOverlay} />}
      <Table.container>
        <Table.table style={{ minHeight: (pageSize + 1) * 52 }}>
          <Table.thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.thr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...(header.column.columnDef.maxSize && {
                        maxWidth: header.column.columnDef.maxSize,
                      }),
                      ...(header.column.columnDef.size && {
                        width: header.column.columnDef.size,
                      }),
                      ...(header.column.columnDef.minSize && {
                        minWidth: header.column.columnDef.minSize,
                      }),
                    }}
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
                if (HoverElement && isMounted) {
                  return (
                    <Popover
                      key={row.id}
                      options={{
                        placement: 'top',
                        modifiers: [
                          { name: 'offset', options: { offset: [0, 0] } },
                          {
                            name: 'sameWidth',
                            enabled: true,
                            fn: ({ state }) => {
                              state.styles.popper.width = `320px`
                            },
                            phase: 'beforeWrite',
                            requires: ['computeStyles'],
                          },
                        ],
                      }}
                    >
                      <Popover.Button>
                        <Table.tr onClick={onClick} className="cursor-pointer">
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <Table.td
                                className="!px-0 relative"
                                style={{
                                  ...(cell.column.columnDef.maxSize && {
                                    maxWidth: cell.column.columnDef.maxSize,
                                  }),
                                  ...(cell.column.columnDef.size && {
                                    width: cell.column.columnDef.size,
                                  }),
                                  ...(cell.column.columnDef.minSize && {
                                    minWidth: cell.column.columnDef.minSize,
                                  }),
                                }}
                                key={cell.id}
                              >
                                {linkFormatter ? (
                                  <Link.Internal href={linkFormatter(row.original)} passHref={true} shallow={true}>
                                    <a
                                      className={classNames(
                                        'absolute inset-0 flex items-center px-3 sm:px-4',
                                        cell.column.columnDef.meta?.className
                                      )}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </a>
                                  </Link.Internal>
                                ) : (
                                  <div
                                    className={classNames(
                                      'absolute inset-0 flex items-center px-3 sm:px-4',
                                      cell.column.columnDef.meta?.className
                                    )}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </div>
                                )}
                              </Table.td>
                            )
                          })}
                        </Table.tr>
                      </Popover.Button>
                      <Popover.Panel>
                        <HoverElement row={row.original} />
                      </Popover.Panel>
                    </Popover>
                  )
                } else {
                  return (
                    <Table.tr onClick={onClick} key={row.id} className="cursor-pointer">
                      {row.getVisibleCells().map((cell, i) => {
                        return (
                          <Table.td
                            className="!px-0 relative"
                            style={{
                              ...(cell.column.columnDef.maxSize && {
                                maxWidth: cell.column.columnDef.maxSize,
                              }),
                              ...(cell.column.columnDef.size && {
                                width: cell.column.columnDef.size,
                              }),
                              ...(cell.column.columnDef.minSize && {
                                minWidth: cell.column.columnDef.minSize,
                              }),
                            }}
                            key={cell.id}
                          >
                            {linkFormatter ? (
                              <Link.Internal href={linkFormatter(row.original)} passHref={true}>
                                <a
                                  className={classNames(
                                    'absolute inset-0 flex items-center px-3 sm:px-4',
                                    cell.column.columnDef.meta?.className
                                  )}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </a>
                              </Link.Internal>
                            ) : (
                              <div
                                className={classNames(
                                  'absolute inset-0 flex items-center px-3 sm:px-4',
                                  cell.column.columnDef.meta?.className
                                )}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            )}
                          </Table.td>
                        )
                      })}
                    </Table.tr>
                  )
                }
              })}
            {!loading &&
              table.getRowModel().rows.length !== 0 &&
              Array.from(Array(Math.max(pageSize - table.getRowModel().rows.length, 0))).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map((column) => (
                    <Table.td
                      key={column.id}
                      style={{
                        ...(column.columnDef.maxSize && {
                          maxWidth: column.columnDef.maxSize,
                        }),
                        ...(column.columnDef.size && {
                          maxWidth: column.columnDef.size,
                        }),
                        ...(column.columnDef.minSize && {
                          maxWidth: column.columnDef.minSize,
                        }),
                      }}
                    />
                  ))}
                </Table.tr>
              ))}
            {loading &&
              Array.from(Array(pageSize)).map((el, index) => (
                <Table.tr key={index}>
                  {table.getVisibleFlatColumns().map((column) => {
                    return (
                      <Table.td
                        key={column.id}
                        style={{
                          maxWidth: column.getSize(),
                          width: column.getSize(),
                        }}
                      >
                        {column.columnDef.meta?.skeleton}
                      </Table.td>
                    )
                  })}
                </Table.tr>
              ))}
            {!loading && table.getRowModel().rows.length === 0 && (
              <Table.tr className="!h-[260px]">
                <Table.td colSpan={table.getAllColumns().length} className="!h-[260px] pointer-events-none">
                  <Typography variant="xs" className="w-full text-center text-slate-400">
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
