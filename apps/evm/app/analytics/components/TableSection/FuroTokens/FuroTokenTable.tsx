import { Container } from '@sushiswap/ui/components/container'
import { Table } from '@sushiswap/ui/components/table'
import { GenericTable } from '@sushiswap/ui/components/table/GenericTable'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import { useFilters } from '../../Filters'
import { LIQUIDITY_COLUMN, LIQUIDITY_USD_COLUMN, NAME_COLUMN, NETWORK_COLUMN } from './columns'
import { PAGE_SIZE } from './constants'
import { FuroTokenFilters } from './FuroTokenFilters'
import { FuroToken, GetFuroTokenArgs, useFuroTokens } from './useFuroTokens'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, LIQUIDITY_USD_COLUMN, LIQUIDITY_COLUMN] as any

export const FuroTokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo<GetFuroTokenArgs>(
    () => ({
      chainIds,
      tokenSymbols,
    }),
    [chainIds, tokenSymbols]
  )

  const { data: furoTokens, isLoading } = useFuroTokens(args)

  const data = useMemo(() => furoTokens || [], [furoTokens])

  const table = useReactTable<FuroToken>({
    data: data,
    columns: COLUMNS,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil((furoTokens?.length || 0) / PAGE_SIZE),
  })

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <div className="space-y-4">
        <FuroTokenFilters />
        <GenericTable<FuroToken>
          table={table}
          loading={!furoTokens && isLoading}
          placeholder="No tokens found"
          pageSize={PAGE_SIZE}
          linkFormatter={(row) => `/token/${row.id}`}
        />
        <Table.Paginator
          hasPrev={pagination.pageIndex > 0}
          hasNext={pagination.pageIndex < table.getPageCount()}
          onPrev={table.previousPage}
          onNext={table.nextPage}
          page={pagination.pageIndex}
          pages={table.getPageCount()}
          pageSize={PAGE_SIZE}
        />
      </div>
    </Container>
  )
}
