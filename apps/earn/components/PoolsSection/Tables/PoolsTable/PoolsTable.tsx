import { ChainId } from '@sushiswap/chain'
import { Pair } from '@sushiswap/graph-client/.graphclient'
import { GenericTable, Table, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import { PAGE_SIZE } from '../contants'
import { APR_COLUMN, FEES_COLUMN, NAME_COLUMN, NETWORK_COLUMN, TVL_COLUMN, VOLUME_COLUMN } from './Cells/columns'
import { PairQuickHoverTooltip } from './PairQuickHoverTooltip'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, VOLUME_COLUMN, FEES_COLUMN, APR_COLUMN]

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
    selectedPoolTypes: string[]
    farmsOnly: boolean
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

  if (args.selectedNetworks) {
    _url.searchParams.set('networks', stringify(args.selectedNetworks))
  }

  const where = {}
  if (args.query) where['name_contains_nocase'] = args.query
  if (args.selectedPoolTypes) where['type_in'] = args.selectedPoolTypes

  if (Object.keys(where).length > 0) {
    _url.searchParams.set('where', JSON.stringify(where))
  }

  if (args.farmsOnly) {
    _url.searchParams.set('farmsOnly', 'true')
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const PoolsTable: FC = () => {
  const { query, extraQuery, selectedNetworks, selectedPoolTypes, farmsOnly, atLeastOneFilterSelected } =
    usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({ sorting, pagination, selectedNetworks, selectedPoolTypes, farmsOnly, query, extraQuery }),
    [sorting, pagination, selectedNetworks, selectedPoolTypes, farmsOnly, query, extraQuery]
  )

  const { data: pools, isValidating } = useSWR<Pair[]>({ url: '/earn/api/pools', args }, fetcher)

  const { data: poolCount } = useSWR<number>(
    `/earn/api/pools/count${selectedNetworks ? `?networks=${stringify(selectedNetworks)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
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
    if (isSm && !isMd) {
      setColumnVisibility({ volume: false, network: false, rewards: false, fees: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ volume: false, network: false, rewards: false, liquidityUSD: false, fees: false })
    }
  }, [isMd, isSm])

  const rowLink = useCallback((row: Pair) => {
    return `/${row.id}`
  }, [])

  return (
    <>
      <GenericTable<Pair>
        table={table}
        loading={!pools && isValidating}
        HoverElement={isMd ? PairQuickHoverTooltip : undefined}
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
        linkFormatter={rowLink}
      />
      <Table.Paginator
        hasPrev={pagination.pageIndex > 0}
        hasNext={
          !atLeastOneFilterSelected ? pagination.pageIndex < table.getPageCount() : (pools?.length || 0) >= PAGE_SIZE
        }
        nextDisabled={!pools && isValidating}
        onPrev={table.previousPage}
        onNext={table.nextPage}
        page={pagination.pageIndex}
        onPage={table.setPageIndex}
        pages={!atLeastOneFilterSelected ? table.getPageCount() : undefined}
        pageSize={PAGE_SIZE}
      />
    </>
  )
}
