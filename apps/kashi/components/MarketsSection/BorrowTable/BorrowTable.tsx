import { Typography, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { KashiPair } from '../../../.graphclient'
import { BORROW_APR_COLUMN, COLLATERAL_COLUMN, GenericTable, NETWORK_COLUMN, PAGE_SIZE } from '../Tables'

const COLUMNS = [NETWORK_COLUMN, COLLATERAL_COLUMN, BORROW_APR_COLUMN]

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
    .catch((e) => console.log(JSON.stringify(e)))
}

export const BorrowTable: FC = () => {
  const { isSm } = useBreakpoint('sm')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'borrowAPR', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])
  const { data: pools } = useSWR<KashiPair[]>({ url: '/kashi/api/pairs', args }, fetcher)

  const table = useReactTable({
    data: pools ?? [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ network: false, rewards: false })
    }
  }, [isSm])

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="sm" weight={600} className="text-slate-400">
        Borrow
      </Typography>
      <GenericTable<KashiPair> table={table} columns={COLUMNS} HoverElement={() => <span />} />
    </div>
  )
}
