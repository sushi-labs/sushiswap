'use client'

import { Slot } from '@radix-ui/react-slot'
import type {
  GetPools,
  PoolChainId,
  Pools,
} from '@sushiswap/graph-client/data-api'
import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePoolsInfinite } from 'src/lib/hooks'
import { ChainKey } from 'sushi/chain'
import { SushiSwapProtocol } from 'sushi/types'
import { usePoolFilters } from './PoolsFiltersProvider'
import {
  ACTION_COLUMN,
  APR_SPARKLINE_COLUMN,
  APR_WITH_REWARDS_COLUMN,
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  VOL_TVL_COLUMN,
} from './columns-v2'

const COLUMNS = [
  CHAIN_COLUMN,
  POOL_COLUMN,
  POOL_TYPE_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  TVL_COLUMN,
  VOL_TVL_COLUMN,
  APR_WITH_REWARDS_COLUMN,
  APR_SPARKLINE_COLUMN,
  ACTION_COLUMN,
]

interface PoolsTableV2Props {
  chainId: PoolChainId
  onRowClick?(row: Pools[number]): void
  forcedTokenSymbols?: string[]
}

export const PoolsTableV2: FC<PoolsTableV2Props> = ({
  chainId,
  onRowClick,
  forcedTokenSymbols,
}) => {
  const { tokenSymbols, protocols, farmsOnly } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const args = useMemo<Omit<GetPools, 'page'>>(() => {
    const tokenSymbolsSet = new Set([
      ...tokenSymbols.map((symbol) => symbol.toLowerCase()),
      ...(forcedTokenSymbols ?? []).map((symbol) => symbol.toLowerCase()),
    ])
    return {
      chainId,
      search: Array.from(tokenSymbolsSet),
      onlyIncentivized: farmsOnly,
      protocols,
      orderBy: sorting[0]?.id as GetPools['orderBy'],
      orderDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
    }
  }, [chainId, tokenSymbols, forcedTokenSymbols, farmsOnly, sorting, protocols])

  const { data: pools, isLoading, fetchNextPage } = usePoolsInfinite(args)

  const [data, count] = useMemo(
    () => [
      pools?.pages?.flatMap(({ data }) => data) ?? [],
      pools?.pages?.[0]?.count,
    ],
    [pools],
  )

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  const rowRenderer = useCallback(
    (row: Row<Pools[number]>, rowNode: ReactNode) => {
      if (onRowClick)
        return (
          <Slot
            className="cursor-pointer"
            onClick={() => onRowClick?.(row.original)}
          >
            {rowNode}
          </Slot>
        )
      return rowNode
    },
    [onRowClick],
  )

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchNextPage}
      hasMore={data.length < (count ?? 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card className="!border-0 md:!border overflow-hidden">
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={isLoading}
          linkFormatter={(row) =>
            `/${ChainKey[row.chainId]}/pool/${
              row.protocol === SushiSwapProtocol.SUSHISWAP_V2 ? 'v2' : 'v3'
            }/${row.address}`
          }
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={data}
          className="border-t-0"
        />
      </Card>
    </InfiniteScroll>
  )
}
