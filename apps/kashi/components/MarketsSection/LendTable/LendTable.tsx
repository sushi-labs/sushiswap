import { Typography } from '@sushiswap/ui'
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

import { KashiPair } from '../../../.graphclient'
import { ASSET_COLUMN, GenericTable, NETWORK_COLUMN, PAGE_SIZE, SUPPLY_APR_COLUMN } from '../../Table'
import { LendTableHoverElement } from './LendTableHoverElement'
// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, ASSET_COLUMN, SUPPLY_APR_COLUMN]

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

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const LendTable: FC = () => {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'supplyAPR', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])
  const { data: pairs } = useSWR<KashiPair[]>({ url: '/kashi/api/pairs', args }, fetcher)

  console.log({ pairs })

  const table = useReactTable({
    data: pairs ?? [],
    // @ts-ignore
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
    (row: Row<KashiPair>) => {
      void router.push(`/lend/markets/${row.original.asset.symbol.toLowerCase()}`)
    },
    [router]
  )

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="sm" weight={600} className="text-slate-400">
        Lend
      </Typography>
      {/* @ts-ignore */}
      <GenericTable<KashiPair> table={table} columns={COLUMNS} onClick={onClick} HoverElement={LendTableHoverElement} />
    </div>
  )
}
