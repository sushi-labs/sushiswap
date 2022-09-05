import { ChainId } from '@sushiswap/chain'
import { Table, useBreakpoint } from '@sushiswap/ui'
import { getCoreRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table'
import React, { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Pair } from '../../../../.graphclient'
import { PairWithFarmRewards } from '../../../../types'
import { usePoolFilters } from '../../../PoolsProvider'
import { APR_COLUMN, NAME_COLUMN, NETWORK_COLUMN, PAGE_SIZE, TVL_COLUMN, VOLUME_COLUMN } from '../contants'
import { GenericTable } from '../GenericTable'
import { PairQuickHoverTooltip } from '../PairQuickHoverTooltip'
import { usePoolFarmRewardsContext } from '../../../PoolFarmRewardsProvider'
import { useQuery } from 'wagmi'

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
    _url.searchParams.set('pagination', JSON.stringify(args.pagination))
  }

  if (args.selectedNetworks) {
    _url.searchParams.set('networks', JSON.stringify(args.selectedNetworks))
  }

  let where = {}
  if (args.query) {
    where = {
      token0_: { symbol_contains_nocase: args.query },
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

export const PoolsTable: FC = () => {
  const { getRewardsForPair } = usePoolFarmRewardsContext()
  const { query, extraQuery, selectedNetworks } = usePoolFilters()
  const { isSm } = useBreakpoint('sm')
  const { isMd } = useBreakpoint('md')

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

  const {
    data: pools,
    isLoading,
    isError,
  } = useQuery<Pair[]>(['/pool/api/pools', args], () => fetcher({ url: '/pool/api/pools', args }), {
    staleTime: 20_000,
  })

  const { data: poolCount } = useSWR<number>(
    '/pool/api/pools/count',
    (url) => fetch(url).then((response) => response.json()),
    {}
  )

  const data: PairWithFarmRewards[] = useMemo(() => {
    return (
      pools?.map((pool) => {
        const { incentives, farmId, chefType } = getRewardsForPair(pool)

        return {
          ...pool,
          incentives: incentives || [],
          farmId,
          chefType,
        }
      }) || []
    )
  }, [getRewardsForPair, pools])

  const table = useReactTable<PairWithFarmRewards>({
    data,
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
      setColumnVisibility({ volume: false, network: false, rewards: false })
    } else if (isSm) {
      setColumnVisibility({})
    } else {
      setColumnVisibility({ volume: false, network: false, rewards: false, liquidityUSD: false })
    }
  }, [isMd, isSm])

  return (
    <>
      <GenericTable<PairWithFarmRewards>
        table={table}
        columns={COLUMNS}
        loading={isLoading && !isError}
        HoverElement={isMd ? PairQuickHoverTooltip : undefined}
        placeholder="No pools found"
        pageSize={PAGE_SIZE}
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
    </>
  )
}
