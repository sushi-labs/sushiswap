import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useDebounce } from '@sushiswap/hooks'
import { Card, CardHeader, CardTitle, DataTable } from '@sushiswap/ui'
import { PaginationState } from '@tanstack/react-table'
import { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { Pool } from 'utils/hooks/usePools'
import { useUserPositions } from 'utils/hooks/useUserPositions'
import { usePoolFilters } from '../../../PoolFiltersProvider'
import { NAME_COLUMN, TVL_COLUMN } from '../Pools/columns'
import { MYPOSITION_TVL_COLUMN } from './columns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  MYPOSITION_TVL_COLUMN,
] satisfies ColumnDef<Pool, unknown>[]

export const PositionsTable = () => {
  const { tokenSymbols } = usePoolFilters()
  const { account } = useWallet()
  const { data: userPositions, isLoading } = useUserPositions(
    account?.address as string,
    true,
  )
  const data = useMemo(() => userPositions?.flat() || [], [userPositions])

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const debouncedQuery = useDebounce(
    tokenSymbols.join(' ').trimStart().toLowerCase(),
    400,
  )

  const tableData = useMemo(() => {
    if (debouncedQuery.split(' ')[0] === '') return data
    return data.filter(
      (pool) =>
        debouncedQuery
          ?.split(' ')
          .includes(pool.data.token_x_details.symbol.toLowerCase()) ||
        debouncedQuery
          ?.split(' ')
          .includes(pool.data.token_y_details.symbol.toLowerCase()),
    )
  }, [debouncedQuery, data])

  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [sorting, pagination])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pools{' '}
          {tableData?.length ? (
            <span className="text-gray-400 dark:text-slate-500">
              ({tableData?.length})
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        onPaginationChange={setPagination}
        loading={!userPositions || isLoading}
        linkFormatter={rowLink}
        columns={COLUMNS}
        data={data}
        pagination={true}
      />
    </Card>
  )
}
