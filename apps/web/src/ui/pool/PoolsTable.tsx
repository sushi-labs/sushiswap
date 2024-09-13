'use client'

import { UploadIcon } from '@heroicons/react-v1/outline'
import { DownloadIcon } from '@heroicons/react-v1/solid'
import {
  ArrowDownRightIcon,
  EllipsisHorizontalIcon,
  GiftIcon,
  LightBulbIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Slot } from '@radix-ui/react-slot'
import { GetPools, PoolChainId, Pools } from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Chip,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Loader,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ColumnDef, Row, SortingState, TableState } from '@tanstack/react-table'
import Link from 'next/link'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePoolsInfinite } from 'src/lib/hooks'
import { ChainKey } from 'sushi/chain'
import { isMerklChainId } from 'sushi/config'
import { Native } from 'sushi/currency'
import { SushiSwapProtocol } from 'sushi/types'
import { usePoolFilters } from './PoolsFiltersProvider'
import {
  APR_WITH_REWARDS_COLUMN,
  EXPLORE_NAME_COLUMN_POOL,
  TRANSACTIONS_1D_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
} from './columns'

const COLUMNS = [
  EXPLORE_NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1W_COLUMN,
  TRANSACTIONS_1D_COLUMN,
  APR_WITH_REWARDS_COLUMN,
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original.protocol === 'SUSHISWAP_V3' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuLabel>
              {row.original.name}
              <Chip variant="blue" className="ml-2">
                SushiSwap V3
              </Chip>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/${row.original.chainId}/pool/v3/${row.original.address}`}
                >
                  <ArrowDownRightIcon width={16} height={16} className="mr-2" />
                  Pool details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/${row.original.chainId}/pool/v3/${row.original.address}/create`}
                >
                  <PlusIcon width={16} height={16} className="mr-2" />
                  Create position
                </Link>
              </DropdownMenuItem>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild={row.original.isSmartPool}>
                    <DropdownMenuItem
                      asChild
                      disabled={!row.original.isSmartPool}
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/${row.original.chainId}/pool/v3/${row.original.address}/smart`}
                      >
                        <span className="relative">
                          <LightBulbIcon
                            width={16}
                            height={16}
                            className="mr-2"
                          />
                          <sup className="rounded-full bg-background absolute right-[3px]">
                            <PlusIcon width={12} height={12} />
                          </sup>
                        </span>
                        Create smart position
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[240px]">
                    <p>
                      {!row.original.isSmartPool
                        ? 'No Steer vaults available for this pool'
                        : `Smart pools optimize liquidity allocation within custom price ranges, enhancing trading efficiency by
          providing deeper liquidity around the current price, increasing Liquidity Providers (LP) fee earnings.`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    asChild={isMerklChainId(row.original.chainId)}
                  >
                    <DropdownMenuItem
                      asChild
                      disabled={!isMerklChainId(row.original.chainId)}
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/${
                          row.original.chainId
                        }/pool/incentivize?fromCurrency=${
                          row.original.token0Address ===
                          Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token0Address
                        }&toCurrency=${
                          row.original.token1Address ===
                          Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token1Address
                        }&feeAmount=${row.original.swapFee * 10_000 * 100}`}
                      >
                        <GiftIcon width={16} height={16} className="mr-2" />
                        Add incentive
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[240px]">
                    <p>
                      {!isMerklChainId(row.original.chainId)
                        ? 'Not available on this network'
                        : 'Add rewards to a pool to incentivize liquidity providers joining in.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button icon={EllipsisHorizontalIcon} variant="ghost" size="sm">
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuLabel>
              {row.original.name}
              {row.original.protocol === 'SUSHISWAP_V2' && (
                <Chip variant="pink" className="ml-2">
                  SushiSwap V2
                </Chip>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/${row.original.chainId}/pool/v2/${row.original.address}/add`}
                >
                  <PlusIcon width={16} height={16} className="mr-2" />
                  Add liquidity
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/${row.original.chainId}/pool/v2/${row.original.address}/remove`}
                >
                  <MinusIcon width={16} height={16} className="mr-2" />
                  Remove liquidity
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuGroupLabel>Farm rewards</DropdownMenuGroupLabel>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild={row.original.isIncentivized}>
                    <DropdownMenuItem
                      asChild
                      disabled={!row.original.isIncentivized}
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/${row.original.chainId}/pool/v2/${row.original.address}/stake`}
                      >
                        <DownloadIcon width={16} height={16} className="mr-2" />
                        Stake
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[240px]">
                    <p>
                      {!row.original.isIncentivized
                        ? 'No rewards available on this pool'
                        : 'After adding liquidity, stake your liquidity tokens to benefit from extra rewards'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuItem asChild disabled={!row.original.isIncentivized}>
                <Link
                  onClick={(e) => e.stopPropagation()}
                  shallow={true}
                  className="flex items-center"
                  href={`/${row.original.chainId}/pool/v2/${row.original.address}/unstake`}
                >
                  <UploadIcon width={16} height={16} className="mr-2" />
                  Unstake
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    size: 80,
    meta: {
      disableLink: true,
      skeleton: <SkeletonText fontSize="lg" />,
    },
  } satisfies ColumnDef<Pools[number], unknown>,
] as ColumnDef<Pools[number], unknown>[]

interface PoolsTableProps {
  chainId: PoolChainId
  onRowClick?(row: Pools[number]): void
}

export const PoolsTable: FC<PoolsTableProps> = ({ chainId, onRowClick }) => {
  const { tokenSymbols, protocols, farmsOnly, smartPoolsOnly } =
    usePoolFilters()

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const args = useMemo<Omit<GetPools, 'page'>>(() => {
    return {
      chainId,
      search: tokenSymbols,
      onlyIncentivized: farmsOnly,
      onlySmartPools: smartPoolsOnly,
      protocols,
      orderBy: sorting[0]?.id as GetPools['orderBy'],
      orderDirection: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
    }
  }, [chainId, tokenSymbols, farmsOnly, smartPoolsOnly, sorting, protocols])

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
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              <div className="!w-28 !h-[18px]">
                <SkeletonText />
              </div>
            ) : (
              <span>
                Pools{' '}
                <span className="text-gray-400 dark:text-slate-500">
                  ({count ?? 0})
                </span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
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
        />
      </Card>
    </InfiniteScroll>
  )
}
