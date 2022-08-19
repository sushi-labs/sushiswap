import { ChainId } from '@sushiswap/chain'
import { useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Pair } from '../../.graphclient'
import { usePoolFilters } from '../PairsProvider'
import {
  APR_COLUMN,
  FEES_7_COLUMN,
  FEES_24_COLUMN,
  GenericTable,
  NAME_COLUMN,
  NETWORK_COLUMN,
  PAGE_SIZE,
  TVL_COLUMN,
  VOLUME_7_COLUMN,
  VOLUME_24_COLUMN,
} from '../Table'
import { PairQuickHoverTooltip } from './PairTableQuickHoverTooltip'

const COLUMNS = [
  NETWORK_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_24_COLUMN,
  VOLUME_7_COLUMN,
  FEES_24_COLUMN,
  FEES_7_COLUMN,
  APR_COLUMN,
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
    _url.searchParams.set('first', args.pagination.pageSize.toString())
    _url.searchParams.set('skip', (args.pagination.pageSize * args.pagination.pageIndex).toString())
  }

  if (args.selectedNetworks) {
    _url.searchParams.set('networks', JSON.stringify(args.selectedNetworks))
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
}

export const PairTable: FC = () => {
  const { query, extraQuery, selectedNetworks } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')
  const { isLg } = useBreakpoint('lg')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({ sorting, pagination, selectedNetworks, query, extraQuery }),
    [sorting, pagination, selectedNetworks, query, extraQuery]
  )
  const { data: pools, isValidating, error } = useSWR<Pair[]>({ url: '/analytics/api/pairs', args }, fetcher, {})

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
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({ fees24h: false, volume24h: false, fees7d: false, network: false })
    } else if (isSm && isMd && !isLg) {
      setColumnVisibility({ fees24h: false, volume24h: false, network: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ fees24h: false, volume24h: false, tvl: false, network: false, fees7d: false, tvl: false })
    }
  }, [isLg, isMd, isSm])

  return (
    <GenericTable<Pair>
      table={table}
      columns={COLUMNS}
      loading={isValidating && !error && !pools}
      placeholder="No pools found"
      HoverElement={PairQuickHoverTooltip}
    />
  )
}
