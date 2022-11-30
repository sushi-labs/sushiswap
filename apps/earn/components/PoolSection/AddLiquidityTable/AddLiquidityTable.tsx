import { Mint } from '.graphclient'
import { ChainId } from '@sushiswap/chain'
import { Pair } from '@sushiswap/graph-client'
import { GenericTable, Table, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { PAGE_SIZE, TXN_HASH_COLUMN, TXN_BLOCK_COLUMN, MINT_SENDER_COLUMN, MINT_TO_COLUMN, AMOUNT0_COLUMN, AMOUNT1_COLUMN, TXN_AGE_COLUMN } from './Cells/columns'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const COLUMNS = [TXN_HASH_COLUMN, TXN_BLOCK_COLUMN, MINT_SENDER_COLUMN, AMOUNT0_COLUMN, AMOUNT1_COLUMN, MINT_TO_COLUMN, TXN_AGE_COLUMN]

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    sorting: SortingState
    pagination: PaginationState
    chainId: ChainId
    pairId: string
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

  if (args.chainId) {
    _url.searchParams.set('chainId', stringify(args.chainId))
  }
  
  if (args.pairId) {
    _url.searchParams.set('pairId', args.pairId)
  }
  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

export const AddLiquidityTable: FC<{ pair: Pair }> = ({ pair }) => {
  const chainId = pair.chainId
  const pairId = pair.address
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true}])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({ sorting, pagination, chainId, pairId}),
    [sorting, pagination, chainId, pairId]
  )

  const [columnVisibility, setColumnVisibility] = useState({})

  const { data: mints, isValidating } = useSWR<Mint[]>({url: '/earn/api/mints', args }, fetcher)
  const { data: mintsCount } = useSWR<number>(
    `/earn/api/mints/count?chainId=${chainId}&pairId=${pairId}`,
    (url) => fetch(url).then((response) => response.json())
  )

  const table = useReactTable<Mint>({
    data: mints || [],
    columns: COLUMNS,
    state: {
      sorting,
      columnVisibility,
    },
    pageCount: Math.ceil((mintsCount || 0) / PAGE_SIZE),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
  })

  useEffect(() => {
    if (isSm && !isMd) {
      setColumnVisibility({ txnBlock: false, amount0: false, amount1: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ txnBlock: false, amount0: false, amount1: false, sender: false, to: false})
    }
  }, [isMd, isSm])
  
  return (
		<>
      <GenericTable<Mint>
        table={table}
        loading={!mints && isValidating}
        placeholder="No Liquidity Added found"
        pageSize={PAGE_SIZE}
      />
      <Table.Paginator
        hasPrev={pagination.pageIndex > 0}
        hasNext={pagination.pageIndex < table.getPageCount()}
        nextDisabled={!mints && isValidating}
        onPrev={table.previousPage}
        onNext={table.nextPage}
        page={pagination.pageIndex}
        onPage={table.setPageIndex}
        pages={table.getPageCount()}
        pageSize={PAGE_SIZE}
      />
    </>
	)
}