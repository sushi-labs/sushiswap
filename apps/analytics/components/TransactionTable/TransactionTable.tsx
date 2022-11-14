import { ChainId } from '@sushiswap/chain'
import { Transaction } from '../../.graphclient'
import { Table, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { usePoolFilters } from '../PoolsFiltersProvider'
import {
  GenericTable,
  PAGE_SIZE,
  TRANSACTION_HASH_COLUMN,
  TRANSACTION_TYPE_COLUMN,
  TRANSACTION_BLOCK_COLUMN,
  TRANSACTION_AGE_COLUMN,
  TRANSACTION_TO_COLUMN,
  TRANSACTION_AMOUNT_COLUMN,
} from '../Table'

// @ts-ignore
const COLUMNS = [
  TRANSACTION_HASH_COLUMN,
  TRANSACTION_TYPE_COLUMN,
  TRANSACTION_BLOCK_COLUMN,
  TRANSACTION_AGE_COLUMN,
  TRANSACTION_TO_COLUMN,
  TRANSACTION_AMOUNT_COLUMN,
]

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    sorting: SortingState
    pagination: PaginationState
    query: string
    extraQuery: string
    selectedNetworks: ChainId[]
  }
}) => {
  const _url = new URL(url, window.location.origin)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args.pagination) {
    _url.searchParams.set('pagination', stringify(args.pagination))
  }

  if (args.selectedNetworks[0]) {
    _url.searchParams.set('networks', stringify(args.selectedNetworks[0]))
  }

  let where = {}
  if (args.query) {
    where = {
      symbol_contains_nocase: args.query,
    }

    _url.searchParams.set('where', stringify(where))
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const TransactionTable: FC = () => {
  const { query, selectedNetworks } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAtTimestamp', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({ sorting, pagination, selectedNetworks, query }),
    [sorting, pagination, selectedNetworks, query]
  )

  const { data: transactions, isValidating } = useSWR<Transaction[]>(
    { url: '/analytics/api/transactions', args },
    fetcher
  )
  const { data: transactionCount } = useSWR<number>(
    `/analytics/api/transactions/count${selectedNetworks ? `?networks=${stringify(selectedNetworks[0])}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const table = useReactTable<Transaction>({
    data: transactions || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((transactionCount || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({ txnType: false, txnBlock: false, TxnTo: false, TxnAmount: false })
    } else if (isSm && isMd && !isLg) {
      setColumnVisibility({ xnType: false, txnBlock: false, TxnAmount: false })
    } else if (isSm) {
      setColumnVisibility({})
    }
  }, [isLg, isMd, isSm])

  return (
    <div>
      <GenericTable<Transaction>
        table={table}
        columns={COLUMNS}
        loading={!transactions && isValidating}
        placeholder="No tokens found"
        pageSize={PAGE_SIZE}
      />
      <Table.Paginator
        hasPrev={pagination.pageIndex > 0}
        hasNext={pagination.pageIndex < table.getPageCount()}
        onPrev={table.previousPage}
        onNext={table.nextPage}
        page={pagination.pageIndex}
        onPage={table.setPageIndex}
        pages={table.getPageCount()}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
