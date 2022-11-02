import { Typography } from '@sushiswap/ui'
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { DEFAULT_MARKETS } from 'config'
import stringify from 'fast-json-stable-stringify'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

import { KashiPair, QuerypairsArgs } from '../../../.graphclient'
import { ASSET_COLUMN, BORROW_APR_COLUMN, GenericTable, NETWORK_COLUMN, TOTAL_BORROW_USD } from '../../Table'
import { BorrowTableHoverElement } from './BorrowTableHoverElement'

const COLUMNS = [NETWORK_COLUMN, ASSET_COLUMN, TOTAL_BORROW_USD, BORROW_APR_COLUMN]

const fetcher = ({ url, args }: { url: string; args: { sorting: SortingState; pagination: PaginationState } }) => {
  const _url = new URL(url, window.location.origin)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args.pagination) {
    _url.searchParams.set('first', args.pagination.pageSize.toString())
    _url.searchParams.set('skip', (args.pagination.pageSize * args.pagination.pageIndex).toString())
  }

  const where: QuerypairsArgs['where'] = {}

  _url.searchParams.set('where', stringify(where))

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const BorrowTable: FC = () => {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'totalBorrowUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_MARKETS.length,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])
  const { data } = useSWR<KashiPair[]>({ url: '/kashi/api/pairs', args }, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  })
  const pairs = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((pair) => new KashiMediumRiskLendingPairV1(pair))
            .sort((a, b) => {
              if (b.totalBorrowUSD === a.totalBorrowUSD) return 0
              return b.totalBorrowUSD < a.totalBorrowUSD ? -1 : 1
              // if (JSBI.equal(b.totalBorrowUSD, a.totalBorrowUSD)) return 0
              // return JSBI.lessThan(b.totalBorrowUSD, a.totalBorrowUSD) ? -1 : 1
            })
        : [],
    [data]
  )
  const table = useReactTable({
    data: pairs ?? [],
    columns: COLUMNS,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  const onClick = useCallback(
    (row: Row<KashiMediumRiskLendingPairV1>) => {
      if (row.original.collateral.symbol)
        void router.push(`/borrow/markets/${row.original.collateral.symbol.toLowerCase()}`)
    },
    [router]
  )

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="sm" weight={600} className="text-slate-400">
        Borrow
      </Typography>
      <GenericTable<KashiMediumRiskLendingPairV1>
        table={table}
        columns={COLUMNS}
        onClick={onClick}
        HoverElement={BorrowTableHoverElement}
      />
    </div>
  )
}
