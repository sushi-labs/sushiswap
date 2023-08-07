import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { useIsMounted } from '@sushiswap/hooks'
import { flexRender, RowData, Table as ReactTableType } from '@tanstack/react-table'
import classNames from 'classnames'
import React, { ReactNode, useCallback, useState } from 'react'

import { LinkInternal } from '../link'
import { LoadingOverlay } from '../loader'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip'
import { Table } from '.'

interface GenericTableProps<C> {
  table: ReactTableType<C>
  HoverElement?: React.FunctionComponent<{ row: C }>
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
                    <TooltipProvider key={r}>
                      <Tooltip>
                        <TooltipTrigger asChild>
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
                                    <LinkInternal href={linkFormatter(row.original)} passHref={true} shallow={true}>
                                      <a
                                        className={classNames(
                                          'absolute inset-0 flex items-center px-3 sm:px-4',
                                          cell.column.columnDef.meta?.className
                                        )}
                                      >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </a>
                                    </LinkInternal>
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
                        </TooltipTrigger>
                        <TooltipContent className="w-fit min-w-[min(90vw,_420px)]">
                          <HoverElement row={row.original} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                              <LinkInternal href={linkFormatter(row.original)} passHref={true}>
                                <a
                                  className={classNames(
                                    'absolute inset-0 flex items-center px-3 sm:px-4',
                                    cell.column.columnDef.meta?.className
                                  )}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </a>
                              </LinkInternal>
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
                  <p className="text-xs w-full text-center text-slate-400">{placeholder}</p>
                </Table.td>
              </Table.tr>
            )}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </>
  )
}
