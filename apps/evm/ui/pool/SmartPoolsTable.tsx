'use client'

import { EllipsisHorizontalIcon, GiftIcon, LightBulbIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { UploadIcon } from '@heroicons/react-v1/outline'
import { DownloadIcon } from '@heroicons/react-v1/solid'
import { Protocol, SteerVaults } from '@sushiswap/client'
import { useSteerVaults } from '@sushiswap/client/hooks'
import { Native, Token } from '@sushiswap/currency'
import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  classNames,
  Currency,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LinkExternal,
  NetworkIcon,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ColumnDef, PaginationState, SortingState, TableState } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { isAngleEnabledChainId } from '../../config'
import { APRHoverCard } from './APRHoverCard'
import { ProtocolBadge } from './PoolNameCell'
import { usePoolFilters } from './PoolsFiltersProvider'
import { SteerStrategyConfig } from './Steer/constants'

const COLUMNS = [
  {
    id: 'poolName',
    header: 'Pool name',
    cell: ({ row: { original } }) => {
      const token0 = new Token({
        chainId: original.chainId,
        address: original.token0.address,
        decimals: original.token0.decimals,
        symbol: original.token0.symbol,
      })
      const token1 = new Token({
        chainId: original.chainId,
        address: original.token1.address,
        decimals: original.token1.decimals,
        symbol: original.token1.symbol,
      })

      return (
        <div className="flex items-center gap-5">
          <div className="flex min-w-[54px]">
            <Badge
              className="border-2 border-slate-900 rounded-full z-[11]"
              position="bottom-right"
              badgeContent={<NetworkIcon chainId={original.chainId} width={14} height={14} />}
            >
              <Currency.IconList iconWidth={26} iconHeight={26}>
                <Currency.Icon disableLink currency={token0} />
                <Currency.Icon disableLink currency={token1} />
              </Currency.IconList>
            </Badge>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
              {original.token0.symbol} <span className="font-normal text-gray-900 dark:text-slate-500">/</span>{' '}
              {original.token1.symbol}{' '}
              <div className={classNames('text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1')} />
            </span>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>{ProtocolBadge[original.pool.protocol]}</TooltipTrigger>
                  <TooltipContent>
                    <p>Protocol version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                      {formatNumber(original.pool.swapFee * 100)}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Swap fee</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {original.pool.incentives && original.pool.incentives.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
                        🧑‍🌾 {original.pool.incentives.length > 1 ? `x ${original.pool.incentives.length}` : ''}{' '}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Farm rewards available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-[#F2E9D6] dark:bg-yellow/60 text-[10px] px-2 rounded-full">💡</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Smart Pool available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )
    },
    meta: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
    size: 300,
  },
  {
    id: 'name',
    header: 'Strategy',
    cell: ({ row: { original } }) => (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <span className="underline decoration-dotted underline-offset-2">
              {original.strategy.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{SteerStrategyConfig[original.strategy].description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'liquidityUSD',
    header: 'TVL',
    accessorFn: (row) => row.pool.liquidityUSD,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number(rowA.pool.liquidityUSD) - Number(rowB.pool.liquidityUSD),
    cell: ({ row: { original } }) => (
      <span className="flex gap-2">
        {formatUSD(original.pool.liquidityUSD).includes('NaN') ? '$0.00' : formatUSD(original.pool.liquidityUSD)}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted underline-offset-2 text-muted-foreground">
                {formatUSD(original.reserveUSD).includes('NaN') ? '$0.00' : formatUSD(original.reserveUSD)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Amount of liquidity staked in the vault.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    ),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'fees1d',
    header: 'Fees (24h)',
    accessorFn: (row) => row.pool.fees1d,
    cell: (props) =>
      formatUSD(props.row.original.pool.fees1d).includes('NaN') ? '$0.00' : formatUSD(props.row.original.pool.fees1d),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'totalApr1d',
    header: 'APR',
    accessorFn: (row) => row.pool.totalApr1d,
    cell: (props) => (
      <APRHoverCard pool={props.row.original.pool}>
        <span className="underline decoration-dotted underline-offset-2">
          {formatPercent(props.row.original.pool.totalApr1d)}
        </span>
      </APRHoverCard>
    ),
    meta: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original.pool.protocol === 'SUSHISWAP_V3' ? (
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
                  href={`/pool/${row.original.id}/positions/create/manual`}
                >
                  <PlusIcon width={16} height={16} className="mr-2" />
                  Create position
                </Link>
              </DropdownMenuItem>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem asChild>
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/pool/${row.original.id}/smart`}
                      >
                        <span className="relative">
                          <LightBulbIcon width={16} height={16} className="mr-2" />
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
                      {`Smart pools optimize liquidity allocation within custom price ranges, enhancing trading efficiency
                      by providing deeper liquidity around the current price, increasing LPs' fee earnings while
                      allowing the market to determine the distribution of rational LPs' positions.`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild={isAngleEnabledChainId(row.original.chainId)}>
                    <DropdownMenuItem asChild disabled={!isAngleEnabledChainId(row.original.chainId)}>
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        shallow={true}
                        className="flex items-center"
                        href={`/pool/incentivize?chainId=${row.original.chainId}&fromCurrency=${
                          row.original.token0.address === Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token0.address
                        }&toCurrency=${
                          row.original.token1.address === Native.onChain(row.original.chainId).wrapped.address
                            ? 'NATIVE'
                            : row.original.token1.address
                        }&feeAmount=${row.original.pool.swapFee * 10_000 * 100}`}
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
              {row.original.pool.protocol === Protocol.BENTOBOX_STABLE && (
                <Chip variant="green" className="ml-2">
                  Trident Stable
                </Chip>
              )}
              {row.original.pool.protocol === Protocol.BENTOBOX_CLASSIC && (
                <Chip variant="green" className="ml-2">
                  Trident Classic
                </Chip>
              )}
              {row.original.pool.protocol === 'SUSHISWAP_V2' && (
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
                  <TooltipTrigger asChild={row.original.pool.incentives && row.original.pool.incentives.length > 0}>
                    <DropdownMenuItem
                      asChild
                      disabled={!(row.original.pool.incentives && row.original.pool.incentives.length > 0)}
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
                      {!(row.original.pool.incentives && row.original.pool.incentives.length > 0)
                        ? 'No rewards available on this pool'
                        : `After adding liquidity, stake your liquidity tokens to benefit from extra rewards`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuItem
                asChild
                disabled={!(row.original.pool.incentives && row.original.pool.incentives.length > 0)}
              >
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
] satisfies ColumnDef<SteerVaults[0], unknown>[]

export const SmartPoolsTable = () => {
  const { chainIds, protocols, farmsOnly } = usePoolFilters()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'liquidityUSD', desc: true }])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: vaults, isValidating: isValidatingVaults } = useSteerVaults({
    args: { chainIds: chainIds, orderBy: 'reserveUSD', orderDir: 'desc' },
  })

  const state: Partial<TableState> = useMemo(() => {
    return {
      sorting,
      pagination,
    }
  }, [sorting, pagination])

  const _vaults: SteerVaults = useMemo(
    () =>
      vaults
        ? vaults
            .filter((el) => (farmsOnly ? el.pool.incentives.length > 0 : true))
            .filter((el) => (protocols.length > 0 ? protocols.includes(el.pool.protocol) : true))
        : [],
    [protocols, farmsOnly, vaults]
  )

  console.log(_vaults)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Smart Pools{' '}
          {_vaults?.length ? <span className="text-gray-400 dark:text-slate-500">({_vaults.length})</span> : null}
        </CardTitle>
        <CardDescription>
          Steer Finance employs an automated approach to optimize your position, strategically moving it within a
          defined range to capitalize on increased APR yields, albeit with the inclusion of a management fee. Various
          strategies are available, each with subtle variations in position management. To learn more about how a
          specific strategy operates, simply hover over its name for detailed information. To learn more about Smart
          Pools, click{' '}
          <LinkExternal href="https://steer.finance/steer-protocol-and-sushi-collaborate-to-optimize-concentrated-liquidity/">
            here
          </LinkExternal>
          .
        </CardDescription>
      </CardHeader>
      <DataTable
        onPaginationChange={setPagination}
        pagination={true}
        state={state}
        linkFormatter={(row) => `/pool/${row.pool.id}/smart/${row.id}`}
        onSortingChange={setSorting}
        loading={!vaults && isValidatingVaults}
        columns={COLUMNS}
        data={_vaults}
      />
    </Card>
  )
}
