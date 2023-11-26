import React, { useCallback, useMemo, useState } from 'react'
import { Pool, usePools } from 'utils/usePools'
import { PaginationState, SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { APR_COLUMN, NAME_COLUMN, RESERVE_COLUMN, TVL_COLUMN } from './Cells/columns'
import { useFarms } from 'utils/useFarms'
import { useDebounce } from '@sushiswap/hooks'
import { useNetwork } from 'utils/useNetwork'

const columns = [NAME_COLUMN, TVL_COLUMN, APR_COLUMN, RESERVE_COLUMN] as any

interface Props {
  farmsOnly: boolean
  query: string
}
export const PoolsTable = ({ farmsOnly, query }: Props) => {
  const { data: pools, isLoading } = usePools()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const { data: farms } = useFarms()

  const {
    contracts: { swap: swapContract },
  } = useNetwork()

  const farmFilter = useMemo(() => {
    return pools?.filter((pool) => {
      const lpAddress = pool.id
      const _isFarm = farms?.data?.lps.indexOf(`${swapContract}::swap::LPToken<${lpAddress}>`)
      return _isFarm !== -1
    })
  }, [pools, farms, swapContract])
  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])
  const data = useMemo(
    () => (!farmsOnly ? pools?.flat() || [] : farmFilter?.flat() || []),
    [pools, farmsOnly, farmFilter]
  )
  const debouncedQuery = useDebounce(query.trimStart().toLowerCase(), 400)
  const tableData = useMemo(() => {
    if (debouncedQuery.split(' ')[0] === '') return data
    return data.filter(
      (pool) =>
        debouncedQuery?.split(' ').includes(pool.data.token_x_details.symbol.toLowerCase()) ||
        debouncedQuery?.split(' ').includes(pool.data.token_y_details.symbol.toLowerCase())
    )
  }, [debouncedQuery, data])

  const table = useReactTable<Pool>({
    data: tableData,
    state: {
      sorting,
    },
    columns: columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    sortDescFirst: true,
  })
  return (
    <GenericTable<Pool>
      table={table}
      placeholder="No Pools Found"
      pageSize={tableData?.length ? tableData?.length : 5}
      loading={!pools || isLoading}
      testId="pools"
      linkFormatter={rowLink}
    />
  )
}
