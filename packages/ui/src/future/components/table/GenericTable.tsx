import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { flexRender, RowData, Table as ReactTableType } from '@tanstack/react-table'
import React, { ReactNode, useCallback, useState } from 'react'
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
  HoverElementWidth?: number
  loading?: boolean
  placeholder: ReactNode
  pageSize: number
  linkFormatter?(row: C): string
  loadingOverlay?: boolean
  headRowHeight?: number
  rowHeight?: number
  testId?: string
  onClick?(row: C): void
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
  HoverElementWidth,
  loading,
  placeholder,
  pageSize,
  linkFormatter,
  loadingOverlay = true,
  headRowHeight = 48,
  rowHeight = 78,
  testId,
  onClick: _onClick,
}: GenericTableProps<T>) => {
  const isMounted = useIsMounted()
  const [showOverlay, setShowOverlay] = useState(false)
  const [, setPopupInvisible] = useState(false)

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: T) => {
      if (_onClick) {
        _onClick(row)
      } else if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey) {
        setPopupInvisible(true)
        setTimeout(() => setShowOverlay(true), 250)
      }
    },
    [_onClick]
  )

  return (
    <>
      {loadingOverlay && <LoadingOverlay show={showOverlay} />}
      <Table.container testId={`${testId}-table-container`}>
        <Table.table testId={`${testId}-table`} style={{ minHeight: (pageSize + 1) * 52 }}>
          <Table.thead testId={`${testId}-thead`}>
            {table.getHeaderGroups().map((headerGroup, i) => (
              <Table.thr testId={`${testId}-${i}-thr`} key={headerGroup.id} headRowHeight={headRowHeight}>
                {headerGroup.headers.map((header, j) => (
                  <Table.th
                    testId={`${testId}-${i}-${j}-th`}
                    headRowHeight={headRowHeight}
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...(header.column.columnDef.size && {
                        minWidth: header.column.columnDef.size,
                        width: header.column.columnDef.size,
                        maxWidth: header.column.columnDef.size,
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
          <Table.tbody testId={`${testId}-thead`}>
            {!loading &&
              table.getRowModel().rows.map((row, r) => {
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
                              state.styles.popper.width = HoverElementWidth ? `${HoverElementWidth}px` : '320px'
                            },
                            phase: 'beforeWrite',
                            requires: ['computeStyles'],
                          },
                        ],
                      }}
                    >
                      <Popover.Button>
                        <Table.tr
                          testId={`${testId}-${r}-tr`}
                          onClick={(e) => onClick(e, row.original)}
                          className={linkFormatter || _onClick ? 'cursor-pointer' : ''}
                          rowHeight={rowHeight}
                        >
                          {row.getVisibleCells().map((cell, i) => {
                            return (
                              <Table.td
                                testId={`${testId}-${r}-${i}-td`}
                                className="!px-0 relative"
                                style={{
                                  ...(cell.column.columnDef.size && {
                                    minWidth: cell.column.columnDef.size,
                                    width: cell.column.columnDef.size,
                                    maxWidth: cell.column.columnDef.size,
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
                    <Table.tr
                      testId={`${testId}-${r}-tr`}
                      onClick={(e) => onClick(e, row.original)}
                      key={row.id}
                      className={linkFormatter || _onClick ? 'cursor-pointer' : ''}
                      rowHeight={rowHeight}
                    >
                      {row.getVisibleCells().map((cell, i) => {
                        return (
                          <Table.td
                            testId={`${testId}-${r}-${i}-td`}
                            className="!px-0 relative"
                            style={{
                              ...(cell.column.columnDef.size && {
                                minWidth: cell.column.columnDef.size,
                                width: cell.column.columnDef.size,
                                maxWidth: cell.column.columnDef.size,
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
                <Table.tr testId={`${testId}-filler-${index}`} key={index} rowHeight={rowHeight}>
                  {table.getVisibleFlatColumns().map((column) => (
                    <Table.td
                      testId={`${testId}-filler-${index}`}
                      key={column.id}
                      style={{
                        ...(column.columnDef.size && {
                          minWidth: column.columnDef.size,
                          width: column.columnDef.size,
                          maxWidth: column.columnDef.size,
                        }),
                      }}
                    />
                  ))}
                </Table.tr>
              ))}
            {loading &&
              Array.from(Array(pageSize)).map((el, index) => (
                <Table.tr testId={`${testId}-loading-${index}`} key={index} rowHeight={rowHeight}>
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
              <Table.tr testId={`${testId}-placeholder`} className="!h-[260px]">
                <Table.td
                  testId={`${testId}-placeholder`}
                  colSpan={table.getAllColumns().length}
                  className="!h-[260px] pointer-events-none"
                >
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
