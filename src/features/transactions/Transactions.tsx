import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import {
  TABLE_TABLE_CLASSNAME,
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
  TABLE_TR_TH_CLASSNAME,
  TABLE_WRAPPER_DIV_CLASSNAME,
} from 'app/features/trident/constants'
import { useTridentTransactions } from 'app/services/graph/hooks/pools'
import { useLegacyTransactions } from 'app/services/graph/hooks/transactions/legacy'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import { useFlexLayout, usePagination, useSortBy, useTable } from 'react-table'

import Typography from '../../components/Typography'
import { TablePageToggler } from './TablePageToggler'
import { TransactionFetcherState } from './types'
import { useTableConfig } from './useTableConfig'

export const LegacyTransactions: FC<{ pairs: string[] }> = ({ pairs }) => {
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const { transactions, error, loading } = useLegacyTransactions(chainId, pairs)
  return <_Transactions chainId={chainId} transactions={transactions} error={error} loading={loading} />
}

export const TridentTransactions: FC<{ poolAddress?: string }> = ({ poolAddress }) => {
  const { chainId } = useActiveWeb3React()

  const {
    data,
    error,
    isValidating: loading,
  } = useTridentTransactions({
    chainId,
    variables: { poolAddress: poolAddress?.toLowerCase() },
    shouldFetch: !!poolAddress,
  })

  return <_Transactions chainId={chainId} transactions={data ?? []} error={error} loading={loading} />
}

const _Transactions: FC<TransactionFetcherState> = ({ chainId = ChainId.ETHEREUM, transactions, error, loading }) => {
  const { i18n } = useLingui()
  const { config } = useTableConfig(chainId, transactions)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-ignore TYPE NEEDS FIXING
    page,
    // @ts-ignore TYPE NEEDS FIXING
    gotoPage,
    // @ts-ignore TYPE NEEDS FIXING
    canPreviousPage,
    // @ts-ignore TYPE NEEDS FIXING
    canNextPage,
    prepareRow,
    // @ts-ignore TYPE NEEDS FIXING
    state: { pageIndex, pageSize },
    // @ts-ignore TYPE NEEDS FIXING
  } = useTable(config, useSortBy, usePagination, useFlexLayout)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Typography variant="h3" className="text-high-emphesis" weight={700}>
          {i18n._(t`Transactions`)}
        </Typography>
        <LoadingSpinner active={loading} />
        {error && <span className="-ml-2 text-sm italic text-red">{i18n._(t`⚠️ Loading Error`)}</span>}
      </div>

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
        totalItems={transactions ? transactions.length : 0}
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        loading={loading}
      />
    </div>
  )
}
