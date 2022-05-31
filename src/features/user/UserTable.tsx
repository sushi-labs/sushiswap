import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { TablePageToggler } from 'app/features/transactions/TablePageToggler'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import React, { FC } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import { useFilters, useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import { useTableConfig } from './useTableConfig'

const UserTable: FC<{ chainId: number; users: any }> = ({ chainId, users }) => {
  const { config } = useTableConfig(chainId, users)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // @ts-ignore TYPE NEEDS FIXING
    page,
    // @ts-ignore TYPE NEEDS FIXING
    gotoPage,
    // @ts-ignore TYPE NEEDS FIXING
    canPreviousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canNextPage,
    // @ts-ignore TYPE NEEDS FIXING
    prepareRow,
    // @ts-ignore TYPE NEEDS FIXING
    setFilter,
    // @ts-ignore TYPE NEEDS FIXING
    toggleSortBy,
    // @ts-ignore TYPE NEEDS FIXING
    state: { pageIndex, pageSize },
    // @ts-ignore TYPE NEEDS FIXING
  } = useTable(config, useFlexLayout, useFilters, useSortBy, usePagination)

  return (
    <div className="flex flex-col gap-2">
      <div className={TABLE_WRAPPER_DIV_CLASSNAME}>
        <table {...getTableProps()} className={TABLE_TABLE_CLASSNAME}>
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <th
                    // @ts-ignore TYPE NEEDS FIXING
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                    className={TABLE_TR_TH_CLASSNAME(i, headerGroup.headers.length)}
                  >
                    {column.render('Header')}
                    <span className="inline-block ml-1 align-middle">
                      {/*@ts-ignore TYPE NEEDS FIXING*/}
                      {column.isSorted ? (
                        // @ts-ignore TYPE NEEDS FIXING
                        column.isSortedDesc ? (
                          <ArrowDownIcon width={12} />
                        ) : (
                          <ArrowUpIcon width={12} />
                        )
                      ) : (
                        ''
                      )}
                    </span>
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
                <tr {...row.getRowProps()} key={i} className={TABLE_TBODY_TR_CLASSNAME}>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  {row.cells.map((cell, i) => {
                    return (
                      <td key={i} {...cell.getCellProps()} className={TABLE_TBODY_TD_CLASSNAME(i, row.cells.length)}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <TablePageToggler
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={rows.length}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        loading={!rows.length}
      />
    </div>
  )
}

export default UserTable
