import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { ReactNode, useState } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import { usePagination, useSortBy, useTable } from 'react-table'

import { classNames } from '../../functions'

export interface Column {
  Cell?: (props: any) => ReactNode
  Header: string
  accessor: string | ((row: any) => ReactNode)
  align?: string
  disableSortBy?: boolean
  // @ts-ignore TYPE NEEDS FIXING
  sortType?: (a, b) => number
}

interface TableProps<T> {
  columns: Column[]
  data: T[]
  columnsHideable?: string[]
  defaultSortBy: {
    id: string
    desc: boolean
  }
  link?: {
    href: string
    id: string
  }
  loading?: boolean
}

export default function Table<T>({
  columns,
  data,
  columnsHideable = [],
  defaultSortBy = { id: '', desc: false },
  link,
  loading = true,
}: TableProps<T>) {
  const [isHidden, setHidden] = useState(columnsHideable.length === 0 ? false : true)
  const router = useRouter()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    // @ts-ignore TYPE NEEDS FIXING
    page,
    // @ts-ignore TYPE NEEDS FIXING
    nextPage,
    // @ts-ignore TYPE NEEDS FIXING
    previousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canPreviousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canNextPage,
    // @ts-ignore TYPE NEEDS FIXING
    setPageSize,
    allColumns,
    // @ts-ignore TYPE NEEDS FIXING
    state: { pageIndex, pageSize },
  } = useTable(
    {
      // @ts-ignore TYPE NEEDS FIXING
      columns,
      // @ts-ignore TYPE NEEDS FIXING
      data,
      defaultCanSort: false,
      autoResetSortBy: false,
      initialState: {
        hiddenColumns: columnsHideable,
        // @ts-ignore TYPE NEEDS FIXING
        sortBy: [
          {
            id: defaultSortBy.id,
            desc: defaultSortBy.desc,
          },
        ],
      },
    },
    useSortBy,
    usePagination
  )

  // @ts-ignore TYPE NEEDS FIXING
  const toggleHide = (e) => {
    // @ts-ignore TYPE NEEDS FIXING
    const list = allColumns.filter((column) => columnsHideable.find((c) => c === column.id))
    // @ts-ignore TYPE NEEDS FIXING
    list.forEach((column) => column.toggleHidden(!isHidden))
    setHidden(!isHidden)
    e.stopPropagation()
  }

  // @ts-ignore TYPE NEEDS FIXING
  const getProperty = (obj, prop) => {
    var parts = prop.split('.')

    if (parts.length === 1) {
      return obj[prop]
    }

    if (Array.isArray(parts)) {
      var last = parts.pop(),
        l = parts.length,
        i = 1,
        current = parts[0]

      while ((obj = obj[current]) && i < l) {
        current = parts[i]
        i++
      }

      if (obj) {
        return obj[last]
      }
    } else {
      throw 'parts is not valid array'
    }
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-auto min-w-full border-collapse table-fixed" {...getTableProps()}>
          <thead>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {headerGroups.map((headerGroup) => (
              // @ts-ignore TYPE NEEDS FIXING
              <tr key="tr" {...headerGroup.getHeaderGroupProps()}>
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {headerGroup.headers.map((column, i, columns) => (
                  //  @ts-ignore TYPE NEEDS FIXING
                  <th key={i} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <div
                      className={classNames(
                        i === 0 && 'pl-2',
                        i === headerGroup.headers.length - 1 && 'pr-2',
                        'select-none w-full'
                      )}
                    >
                      <div className="flex flex-row pb-2 text-sm text-secondary">
                        <div
                          className={classNames(
                            //@ts-ignore TYPE NEEDS FIXING
                            i !== 0 && column.align === 'right' && `justify-end`,
                            // @ts-ignore TYPE NEEDS FIXING
                            i !== 0 && column.align === 'left' && 'justify-start',
                            // @ts-ignore TYPE NEEDS FIXING
                            !column.align && (i !== 0 ? 'justify-start' : 'justify-end'),
                            i !== 0 && 'ml-2',
                            i !== columns.length - 1 && 'mr-2',
                            i === 0 && 'flex-row-reverse',
                            // @ts-ignore TYPE NEEDS FIXING
                            i === 0 ? (column.align === 'right' ? 'justify-start' : 'justify-end') : '',
                            'w-full flex whitespace-nowrap xl:mx-auto'
                          )}
                        >
                          {/* @ts-ignore TYPE NEEDS FIXING */}
                          <span className={classNames('flex items-center', column.isSorted ? 'block' : 'hidden')}>
                            <div
                              className={classNames(
                                'fill-current text-secondary',
                                // @ts-ignore TYPE NEEDS FIXING
                                !column.isSortedDesc && 'rotate-180 transform'
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </span>
                          {column.render('Header')}
                          {/* @ts-ignore TYPE NEEDS FIXING */}
                          {column.HideHeader && isHidden && (
                            <button onClick={(e) => toggleHide(e)} className="ml-1 text-dark-700">
                              {column.render('HideHeader')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr key={i} {...row.getRowProps()}>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {row.cells.map((cell, cI) => {
                    return (
                      <td key={cI} className="pb-3 pl-0 pr-0" {...cell.getCellProps()}>
                        <div
                          onClick={
                            link ? () => router.push(link.href + getProperty(cell.row.original, link.id)) : () => {}
                          }
                        >
                          <div
                            className={classNames(
                              cI === 0 && 'rounded-l pl-4',
                              cI === row.cells.length - 1 && 'rounded-r pr-4',
                              link && 'cursor-pointer',
                              'h-20 text-primary bg-dark-900 flex items-center'
                            )}
                          >
                            <div
                              className={classNames(
                                cell.column.align === 'right' && `text-right`,
                                cell.column.align === 'left' && 'text-left',
                                cI !== 0 && 'ml-2',
                                cI !== row.cells.length - 1 && 'mr-2',
                                'w-full xl:mx-auto'
                              )}
                            >
                              {cell.render('Cell')}
                            </div>
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {data?.length > 10 && (
        <div className="flex justify-between w-full">
          <div className="flex text-sm font-bold text-secondary">
            <div>Rows per page: </div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-1 bg-transparent"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option className="bg-dark-1000" key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <div className="text-sm text-secondary">
              {`${pageSize * pageIndex + 1}-${pageSize * (pageIndex + 1)} of ${rows.length}`}
            </div>
            <button
              onClick={() => previousPage()}
              className={classNames(!canPreviousPage ? 'opacity-50 hover:cursor-default' : '', 'ml-3')}
            >
              <ArrowLeftIcon width={16} height={16} />
            </button>
            <button
              onClick={() => nextPage()}
              className={classNames(!canNextPage ? 'opacity-50 hover:cursor-default' : '', 'ml-3')}
            >
              <ArrowRightIcon width={16} height={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
