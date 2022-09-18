import { ChainId } from '@sushiswap/chain'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { Table, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { usePoolFilters } from '../PoolsFiltersProvider'
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

// @ts-ignore
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
    _url.searchParams.set('pagination', JSON.stringify(args.pagination))
  }

  if (args.selectedNetworks) {
    _url.searchParams.set('networks', JSON.stringify(args.selectedNetworks))
  }

  let where = {}
  if (args.query) {
    where = {
      name_contains_nocase: args.query,
    }

    _url.searchParams.set('where', JSON.stringify(where))
  }

  if (args.extraQuery) {
    where = {
      ...where,
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

  const { data: pools, isValidating } = useSWR<Pair[]>({ url: '/analytics/api/pools', args }, fetcher, {})
  const { data: poolCount } = useSWR<number>(
    `/analytics/api/pools/count${selectedNetworks ? `?networks=${JSON.stringify(selectedNetworks)}` : ''}`,
    (url) => fetch(url).then((response) => response.json()),
    {}
  )

  const table = useReactTable<Pair>({
    data: pools || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((poolCount || 0) / PAGE_SIZE),
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
      setColumnVisibility({ fees24h: false, volume24h: false, network: false, fees7d: false, tvl: false, apr: false })
    }
  }, [isLg, isMd, isSm])

  return (
    <div>
      <GenericTable<Pair>
        table={table}
        columns={COLUMNS}
        loading={!pools && isValidating}
        HoverElement={isMd ? PairQuickHoverTooltip : undefined}
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
        linkFormatter={(id) => `/pool/${id}`}
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
