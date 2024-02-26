'use client'

import { UploadIcon } from '@heroicons/react-v1/outline'
import { DownloadIcon } from '@heroicons/react-v1/solid'
import { ArrowDownRightIcon } from '@heroicons/react/20/solid'
import {
  EllipsisHorizontalIcon,
  GiftIcon,
  LightBulbIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Slot } from '@radix-ui/react-slot'
import { GetPoolsArgs, Pool, Protocol } from '@sushiswap/client'
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
import { Native } from 'sushi/currency'
import { useSWRConfig } from 'swr'

import { usePoolCount, usePoolsInfinite } from '@sushiswap/client/hooks'
import { isAngleEnabledChainId } from 'sushi/config'
import { usePoolFilters } from './PoolsFiltersProvider'
import {
  APR_COLUMN_POOL,
  FEES_COLUMN,
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_7D_COLUMN,
} from './columns'

const COLUMNS = [
  NAME_COLUMN_POOL,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_7D_COLUMN,
  VOLUME_1M_COLUMN,
  FEES_COLUMN,
  APR_COLUMN_POOL,
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
              {row.original.token0.symbol} / {row.original.token1.symbol}
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
                  href={`/pool/${row.original.id}`}
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
                  href={`/pool/${row.original.id}/positions/create`}
                >
                  <PlusIcon width={16} height={16} className="mr-2" />
                  Create position
                </Link>
              </DropdownMenuItem>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild={row.original.hasEnabledSteerVault}>
                    <DropdownMenuItem
                      asChild
                      disabled={!row.original.hasEnabledSteerVault}
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/pool/${row.original.id}/smart`}
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
                      {!row.original.hasEnabledSteerVault
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
                    asChild={isAngleEnabledChainId(row.original.chainId)}
                  >
                    <DropdownMenuItem
                      asChild
                      disabled={!isAngleEnabledChainId(row.original.chainId)}
                    >
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/pool/incentivize?chainId=${
                          row.original.chainId
                        }&fromCurrency=${
                          row.original.token0.address ===
                          Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token0.address
                        }&toCurrency=${
                          row.original.token1.address ===
                          Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token1.address
                        }&feeAmount=${row.original.swapFee * 10_000 * 100}`}
                      >
                        <GiftIcon width={16} height={16} className="mr-2" />
                        Add incentive
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[240px]">
                    <p>
                      {!isAngleEnabledChainId(row.original.chainId)
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
              {row.original.token0.symbol} / {row.original.token1.symbol}
              {row.original.protocol === Protocol.BENTOBOX_STABLE && (
                <Chip variant="green" className="ml-2">
                  Trident Stable
                </Chip>
              )}
              {row.original.protocol === Protocol.BENTOBOX_CLASSIC && (
                <Chip variant="green" className="ml-2">
                  Trident Classic
                </Chip>
              )}
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
                  href={`/pool/${row.original.id}/add`}
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
                  href={`/pool/${row.original.id}/remove`}
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
                        href={`/pool/${row.original.id}/stake`}
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
                  href={`/pool/${row.original.id}/unstake`}
                >
                  <UploadIcon width={16} height={16} className="mr-2" />
                  Unstake
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    meta: {
      disableLink: true,
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
] satisfies ColumnDef<Pool, unknown>[]

interface PositionsTableProps {
  onRowClick?(row: Pool): void
}

export const PoolsTable: FC<PositionsTableProps> = ({ onRowClick }) => {
  const { chainIds, tokenSymbols, protocols, farmsOnly, smartPoolsOnly } =
    usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

  const args = useMemo<GetPoolsArgs>(() => {
    return {
      chainIds: chainIds,
      tokenSymbols,
      isIncentivized: farmsOnly || undefined, // will filter farms out if set to false, undefined will be filtered out by the parser
      hasEnabledSteerVault: smartPoolsOnly || undefined, // will filter smart pools out if set to false, undefined will be filtered out by the parser
      isWhitelisted: false, // can be added to filters later, need to put it here so fallback works
      orderBy: sorting[0]?.id,
      orderDir: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      protocols,
    }
  }, [chainIds, tokenSymbols, farmsOnly, smartPoolsOnly, sorting, protocols])

  const {
    data: pools,
    isValidating,
    error,
    setSize,
  } = usePoolsInfinite({ args, shouldFetch: true, swrConfig: useSWRConfig() })

  console.log(error)
  const { data: poolCount } = usePoolCount({
    args,
    shouldFetch: true,
    swrConfig: useSWRConfig(),
  })
  const data = useMemo(() => pools?.flat() || [], [pools])

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
    (row: Row<Pool>, rowNode: ReactNode) => {
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
      next={() => setSize((prev) => prev + 1)}
      hasMore={data.length < (poolCount?.count || 0)}
      loader={
        <div className="flex justify-center w-full py-4">
          <Loader size={16} />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Pools{' '}
            {poolCount?.count ? (
              <span className="text-gray-400 dark:text-slate-500">
                ({poolCount.count})
              </span>
            ) : null}
          </CardTitle>
        </CardHeader>
        <DataTable
          state={state}
          onSortingChange={setSorting}
          loading={!pools && isValidating}
          linkFormatter={(row) => `/pool/${row.chainId}%3A${row.address}`}
          rowRenderer={rowRenderer}
          columns={COLUMNS}
          data={data}
        />
      </Card>
    </InfiniteScroll>
  )
}
