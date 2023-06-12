import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/graph-client'
import { useBreakpoint } from '@sushiswap/hooks'
import { Table } from '@sushiswap/ui/future/components/table'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { LIQUIDITY_COLUMN, NAME_COLUMN, NETWORK_COLUMN, PRICE_COLUMN, VOLUME_COLUMN } from './columns'
import { TokenFilters } from './TokenFilters'
import { PAGE_SIZE } from './constants'
import { useFilters } from 'components/Filters'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, PRICE_COLUMN, LIQUIDITY_COLUMN, VOLUME_COLUMN] as any

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: Partial<{
    sorting: SortingState
    pagination: PaginationState
    tokenSymbols: string[]
    extraQuery: string
    chainIds: ChainId[]
  }>
}) => {
  const _url = new URL(url, window.location.origin)

  if (args?.sorting?.[0]) {
    _url.searchParams.set('orderBy', args.sorting[0].id)
    _url.searchParams.set('orderDirection', args.sorting[0].desc ? 'desc' : 'asc')
  }

  if (args?.pagination) {
    _url.searchParams.set('pagination', stringify(args.pagination))
  }

  if (args?.chainIds) {
    _url.searchParams.set('networks', stringify(args.chainIds))
  }

  let where = {}
  if (args?.tokenSymbols) {
    where = {
      symbol_contains_nocase: args.tokenSymbols[0],
    }

    _url.searchParams.set('where', stringify(where))
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const TokenTable: FC = () => {
  const { chainIds, search: tokenSymbols } = useFilters()

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
    () => ({ sorting, pagination, chainIds, tokenSymbols }),
    [sorting, pagination, chainIds, tokenSymbols]
  )

  const { data: tokens, isValidating } = useSWR<Token[]>({ url: '/analytics/api/tokens', args }, () =>
    fetcher({ url: '/analytics/api/tokens', args })
  )
  const { data: tokenCount } = useSWR<number>(
    `/analytics/api/tokens/count${chainIds ? `?networks=${stringify(chainIds)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const data = useMemo(() => tokens || [], [tokens])

  const table = useReactTable<Token>({
    data: data,
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((tokenCount || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd && !isLg) {
      setColumnVisibility({ price: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ price: false, volume: false })
    }
  }, [isLg, isMd, isSm])

  return (
    <div className="space-y-4">
      <TokenFilters />
      <GenericTable<Token>
        table={table}
        loading={!tokens && isValidating}
        placeholder="No tokens found"
        pageSize={PAGE_SIZE}
        linkFormatter={(row) => `/analytics/token/${row.id}`}
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
