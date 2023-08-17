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
import { BentoBoxTokenFilters } from './BentoBoxTokenFilters'
import { LIQUIDITY_COLUMN, LIQUIDITY_USD_COLUMN, NAME_COLUMN, NETWORK_COLUMN } from './columns'
import { PAGE_SIZE } from './constants'
import { BentoBoxToken, GetBentoBoxTokenArgs, useBentoBoxTokens } from './useBentoBoxTokens'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, LIQUIDITY_USD_COLUMN, LIQUIDITY_COLUMN] as any

export const BentoBoxTokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo<GetBentoBoxTokenArgs>(
    () => ({
      chainIds,
      tokenSymbols,
    }),
    [chainIds, tokenSymbols]
  )

  const { data: bentoBoxTokens, isLoading } = useBentoBoxTokens(args)

  const data = useMemo(() => bentoBoxTokens || [], [bentoBoxTokens])

  const table = useReactTable<BentoBoxToken>({
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
    pageCount: Math.ceil((bentoBoxTokens?.length || 0) / PAGE_SIZE),
  })

  return (
    <Container maxWidth="7xl" className="px-4 mx-auto">
      <div className="space-y-4">
        <BentoBoxTokenFilters />
        <GenericTable<BentoBoxToken>
          table={table}
          loading={!bentoBoxTokens && isLoading}
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
