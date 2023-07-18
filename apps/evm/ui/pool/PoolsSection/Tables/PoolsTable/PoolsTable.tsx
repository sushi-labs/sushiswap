import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import { ChartBarIcon, DownloadIcon, PlusIcon, UserCircleIcon } from '@heroicons/react-v1/solid'
import { GetPoolsArgs, Pool, Protocol, usePoolCount, usePoolsInfinite } from '@sushiswap/client'
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@sushiswap/ui'
import { Loader } from '@sushiswap/ui'
import { DropdownMenuSeparator } from '@sushiswap/ui'
import { DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@sushiswap/ui'
import { DropdownMenuPortal } from '@sushiswap/ui'
import { ColumnDef, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSWRConfig } from 'swr'

import { usePoolFilters } from '../../../PoolsFiltersProvider'
import {
  APR_COLUMN,
  FEES_COLUMN,
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_7D_COLUMN,
} from './Cells/columns'

const COLUMNS = [
  NAME_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_COLUMN,
  APR_COLUMN,
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuItem asChild>
            <a href={`/pool/${row.original.id}`}>
              <ChartBarIcon width={16} height={16} className="mr-2" /> Details
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              className="flex items-center"
              href={
                row.original.protocol === Protocol.SUSHISWAP_V3
                  ? `/pool/${row.original.id}?activeTab=new`
                  : `/pool/${row.original.id}/add`
              }
            >
              <DownloadIcon width={16} height={16} className="mr-2" />
              Deposit
            </a>
          </DropdownMenuItem>
          {row.original.protocol === Protocol.SUSHISWAP_V3 ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Position</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <a href={`/pool/${row.original.id}?activeTab=new`}>
                        <PlusIcon width={16} height={16} className="mr-2" />
                        Create new position
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href={`/pool/${row.original.id}?activeTab=myPositions`}>
                        <UserCircleIcon width={16} height={16} className="mr-2" /> My positions
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
] satisfies ColumnDef<Pool, unknown>[]

export const PoolsTable: FC = () => {
  const { chainIds, tokenSymbols, protocols, farmsOnly } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])

  const args = useMemo<GetPoolsArgs>(() => {
    return {
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: farmsOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      isWhitelisted: true, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
    }
  }, [chainIds, tokenSymbols, protocols, farmsOnly, sorting])

  const {
    data: pools,
    isValidating,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const { data: poolCount } = usePoolCount({ args, shouldFetch: true, swrConfig: useSWRConfig() })
  const data = useMemo(() => pools?.flat() || [], [pools])

  const rowLink = useCallback((row: Pool) => {
    return `/pool/${row.id}`
  }, [])

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length,
      },
    }
  }, [data?.length, sorting])

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => setSize((prev) => prev + 1)}
      hasMore={data.length < (poolCount?.count || 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={!pools && isValidating}
        linkFormatter={rowLink}
        columns={COLUMNS}
        data={data}
      />
    </InfiniteScroll>
  )
}
