import { ChainId } from '@sushiswap/chain'
import { useBreakpoint } from '@sushiswap/ui'
import { useFarmRewards } from '@sushiswap/wagmi'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Pair } from '../../../../.graphclient'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, PAGE_SIZE, TVL_COLUMN, VOLUME_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PairQuickHoverTooltip } from '../PairQuickHoverTooltip'

// @ts-ignore
const COLUMNS = [NETWORK_COLUMN, NAME_COLUMN, TVL_COLUMN, VOLUME_COLUMN, APR_COLUMN]

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

export const PoolsTable: FC = () => {
  const { query, extraQuery, selectedNetworks } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')

  const [sorting, setSorting] = useState<SortingState>([{ id: 'apr', desc: true }])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const args = useMemo(
    () => ({ sorting, pagination, selectedNetworks, query, extraQuery }),
    [sorting, pagination, selectedNetworks, query, extraQuery]
  )

  const { data: pools, isValidating, error } = useSWR<Pair[]>({ url: '/pool/api/pools', args }, fetcher, {})
  const { data: rewards } = useFarmRewards()

  const data = useMemo(() => {
    return (
      pools?.map((pool) => ({
        ...pool,
        incentives: rewards?.[pool.chainId]?.farms?.[pool.id]?.incentives || [],
      })) || []
    )
  }, [pools, rewards])

  const table = useReactTable({
    data,
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
    <GenericTable<Pair>
      table={table}
      columns={COLUMNS}
      loading={isValidating && !error && !pools}
      HoverElement={PairQuickHoverTooltip}
      placeholder="No pools found"
    />
  )
}
