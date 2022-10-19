import { ChainId } from '@sushiswap/chain'
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
import { useRouter } from 'next/router'
import React, { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

import { KashiMediumRiskLendingPairV1 } from '../../../lib/KashiPair'
import { ASSET_COLUMN, GenericTable, NETWORK_COLUMN, SUPPLY_APR_COLUMN } from '../../Table'
import { LendTableHoverElement } from './LendTableHoverElement'
import { KashiPair, QuerypairsArgs } from '.graphclient'
// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, ASSET_COLUMN, SUPPLY_APR_COLUMN]

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
    _url.searchParams.set('first', args.pagination.pageSize.toString())
    _url.searchParams.set('skip', (args.pagination.pageSize * args.pagination.pageIndex).toString())
  }

  const where: QuerypairsArgs['where'] = { totalBorrow_: { base_gt: '0' } }

  _url.searchParams.set('where', stringify(where))

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const LendTable: FC = () => {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'supplyAPR', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_MARKETS.length,
  })

  const args = useMemo(() => ({ sorting, pagination }), [sorting, pagination])

  // TODO: Automatically serialise/deserialise, middleware?

  const { data } = useSWR<KashiPair[]>({ url: '/kashi/api/pairs', args }, fetcher)

  const pairs = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((pair) => new KashiMediumRiskLendingPairV1(pair))
            .sort((a, b) => {
              if (b.currentSupplyAPR.equalTo(a.currentSupplyAPR)) return 0
              return b.currentSupplyAPR.lessThan(a.currentSupplyAPR) ? -1 : 1
            })
        : [],
    [data]
  )
  // .sort((a, b) => {
  //   if (b.currentSupplyAPR.equalTo(a.currentSupplyAPR)) return 0
  //   return b.currentSupplyAPR.lessThan(a.currentSupplyAPR) ? -1 : 1
  // })
  // const pairs = useMemo(
  //   () =>
  //     data
  //       ? data
  //           .map((pair) => new KashiMediumRiskLendingPairV1(pair))
  //           .sort((a, b) => {
  //             if (b.currentSupplyAPR.equalTo(a.currentSupplyAPR)) return 0
  //             return b.currentSupplyAPR.lessThan(a.currentSupplyAPR) ? -1 : 1
  //           })
  //       : [],
  //   [data]
  // )

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
      if (row.original.asset.symbol) void router.push(`/lend/markets/${row.original.asset.symbol.toLowerCase()}`)
    },
    [router]
  )

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="sm" weight={600} className="text-slate-400">
        Lend
      </Typography>
      <GenericTable<KashiMediumRiskLendingPairV1>
        table={table}
        columns={COLUMNS}
        onClick={onClick}
        HoverElement={LendTableHoverElement}
      />
    </div>
  )
}
