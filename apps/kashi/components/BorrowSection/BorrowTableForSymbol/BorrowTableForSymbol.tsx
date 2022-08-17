import { chainShortName } from '@sushiswap/chain'
import { Chip, Typography, useBreakpoint } from '@sushiswap/ui'
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { KashiPair } from '../../../.graphclient'
import {
  AVAILABLE_FOR_BORROW_COLUMN,
  BORROW_ASSET_COLUMN,
  GenericTable,
  NETWORK_COLUMN,
  PAGE_SIZE,
  TOTAL_APR_COLUMN,
  TOTAL_ASSET_COLUMN,
} from '../../Table'

// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, BORROW_ASSET_COLUMN, TOTAL_APR_COLUMN, TOTAL_ASSET_COLUMN, AVAILABLE_FOR_BORROW_COLUMN]

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: { sorting: SortingState; pagination: PaginationState; where: string }
}) => {
  const _url = new URL(url, window.location.origin)

  if (args.sorting[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args.pagination) {
    _url.searchParams.set('first', args.pagination.pageSize.toString())
    _url.searchParams.set('skip', (args.pagination.pageSize * args.pagination.pageIndex).toString())
  }

  if (args.where) {
    _url.searchParams.set('where', args.where)
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))
}

export const BorrowTableForSymbol: FC = () => {
  const router = useRouter()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'supplyAPR', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])
  const { data: pairs } = useSWR<KashiPair[]>(
    { url: `/kashi/api/pairs?symbol=${(router.query.symbol as string).toLowerCase()}&asset=true`, args },
    fetcher
  )
  const table = useReactTable({
    data: pairs ?? [],
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

  const onClick = useCallback(
    (row: Row<KashiPair>) => {
      void router.push(`/borrow/${chainShortName[row.original.chainId]}:${row.original.id}`)
    },
    [router]
  )

  useEffect(() => {
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({ reward: false, supply: false, totalAsset: false })
    } else if (isSm && isMd && !isLg) {
      setColumnVisibility({ reward: false, supply: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ network: false, reward: false, supply: false, totalAsset: false })
    }
  }, [isLg, isMd, isSm])

  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <Typography variant="h3" weight={500} className="flex gap-2 items-center text-slate-50 font-semibold">
          Borrow Markets <Chip label={pairs?.length} color="blue" />
        </Typography>
      </div>
      <div className="flex flex-col gap-4">
        <GenericTable<KashiPair> size="lg" table={table} columns={COLUMNS} onClick={onClick} />
      </div>
    </>
  )
}
