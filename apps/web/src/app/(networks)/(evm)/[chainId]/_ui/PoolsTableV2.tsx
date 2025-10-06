'use client'

import { Slot } from '@radix-ui/react-slot'
import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import type {
  GetMultiChainPools,
  MultiChainPools,
} from '@sushiswap/graph-client/data-api-181'
import { Card, DataTable, Loader } from '@sushiswap/ui'
import type { Row, SortingState, TableState } from '@tanstack/react-table'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePoolFilters } from 'src/app/(networks)/_ui/pools-filters-provider'
import { useMultichainPoolsInfinite } from 'src/lib/hooks/api/useMultichainPoolsInfinite'
import { chains } from 'sushi'
import { SushiSwapProtocol } from 'sushi/evm'
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
  onRowClick: ((row: MultiChainPools[number]) => void) | undefined
  forcedTokenSymbols?: string[]
}

export const PoolsTableV2: FC<PoolsTableV2Props> = ({
  onRowClick,
  forcedTokenSymbols,
}) => {
  const {
    tokenSymbols,
    protocols,
    farmsOnly,
    networks,
    tvlRangeMin,
    tvlRangeMax,
  } = usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const args = useMemo<Omit<GetMultiChainPools, 'page'>>(() => {
    const tokenSymbolsSet = new Set([
      ...tokenSymbols.map((symbol) => symbol.toLowerCase()),
      ...(forcedTokenSymbols ?? []).map((symbol) => symbol.toLowerCase()),
    ])
    return {
      chainIds: networks as PoolChainId[],
      search: Array.from(tokenSymbolsSet),
      onlyIncentivized: farmsOnly,
      minTvl: tvlRangeMin,
      maxTvl: tvlRangeMax,
      protocols,
      orderBy: sorting[0]?.id as GetMultiChainPools['orderBy'],
      orderDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
    }
  }, [
    networks,
    tokenSymbols,
    forcedTokenSymbols,
    farmsOnly,
    sorting,
    protocols,
    tvlRangeMin,
    tvlRangeMax,
  ])

  const {
    data: pools,
    isLoading,
    fetchNextPage,
  } = useMultichainPoolsInfinite(args)

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
    (row: Row<MultiChainPools[number]>, rowNode: ReactNode) => {
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
        <div className="flex justify-center py-4 w-full">
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
            `/${chains[row.chainId].blockExplorers.default}/pool/${
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
