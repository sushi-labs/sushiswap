import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/graph-client'
import { useBreakpoint } from '@sushiswap/hooks'
import { Table } from '@sushiswap/ui/future/components/table'
import { GenericTable } from '@sushiswap/ui/future/components/table/GenericTable'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { usePoolFilters } from '../PoolsFiltersProvider'
import {
  PAGE_SIZE,
  TOKEN_CHAIN_COLUMN,
  TOKEN_LIQUIDITY_COLUMN,
  TOKEN_NAME_COLUMN,
  TOKEN_PRICE_COLUMN,
  TOKEN_VOLUME_COLUMN,
} from '../Table'

// @ts-ignore
const COLUMNS = [TOKEN_CHAIN_COLUMN, TOKEN_NAME_COLUMN, TOKEN_PRICE_COLUMN, TOKEN_LIQUIDITY_COLUMN, TOKEN_VOLUME_COLUMN]

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    sorting: SortingState
    pagination: PaginationState
    tokenSymbols: string[]
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
    _url.searchParams.set('pagination', stringify(args.pagination))
  }

  if (args.selectedNetworks) {
    _url.searchParams.set('networks', stringify(args.selectedNetworks))
  }

  let where = {}
  if (args.tokenSymbols) {
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
  const { chainIds, tokenSymbols } = usePoolFilters()
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

  const { data: tokens, isValidating } = useSWR<Token[]>({ url: '/analytics/api/tokens', args }, fetcher)
  const { data: tokenCount } = useSWR<number>(
    `/analytics/api/tokens/count${chainIds ? `?networks=${stringify(chainIds)}` : ''}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const table = useReactTable<Token>({
    data: tokens || [],
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
    <div>
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
