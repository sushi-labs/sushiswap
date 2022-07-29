import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Pair } from '../../../../.graphclient'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, PAGE_SIZE, REWARDS_COLUMN, TVL_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PairQuickHoverTooltip } from '../PairQuickHoverTooltip'

const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, APR_COLUMN, REWARDS_COLUMN]

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: { sorting: SortingState; pagination: PaginationState; query: string; extraQuery: string }
}) => {
  try {
    const _url = new URL(url, window.location.origin)

    if (args.sorting[0]) {
      _url.searchParams.set('orderBy', args.sorting[0].id)
      _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
    }

    if (args.pagination) {
      _url.searchParams.set('first', args.pagination.pageSize.toString())
      _url.searchParams.set('skip', (args.pagination.pageSize * args.pagination.pageIndex).toString())
    }

    let where = {}
    if (args.query) {
      where = {
        token0_: { symbol_contains_nocase: args.query },
        token1_: { symbol_contains_nocase: args.query },
      }

      _url.searchParams.set('where', JSON.stringify(where))
    }

    if (args.extraQuery) {
      where = {
        ...where,
        token0_: { symbol_contains_nocase: args.extraQuery },
        token1_: { symbol_contains_nocase: args.extraQuery },
      }

      _url.searchParams.set('where', JSON.stringify(where))
    }

    return fetch(_url.href)
      .then((res) => res.json())
      .catch((e) => console.log(JSON.stringify(e)))
  } catch (e) {
    console.log(e)
  }
}

export const PoolsTable: FC = () => {
  const { query, extraQuery } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'reserveETH', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(() => ({ sorting, pagination, query, extraQuery }), [sorting, pagination, query, extraQuery])
  const { data: pools } = useSWR<Pair[]>({ url: '/pool/api/pools', args }, fetcher)

  const table = useReactTable({
    data: pools ?? [],
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

  return <GenericTable<Pair> table={table} columns={COLUMNS} HoverElement={PairQuickHoverTooltip} />
}
