'use client'

import { SteerVaults } from '@sushiswap/client'
import { useSteerVaults } from '@sushiswap/client/hooks'
import { Token } from '@sushiswap/currency'
import { formatNumber, formatPercent, formatUSD } from '@sushiswap/format'
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  classNames,
  Currency,
  DataTable,
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
import React, { useMemo, useState } from 'react'

import { APRHoverCard } from './APRHoverCard'
import { ProtocolBadge } from './PoolNameCell'
import { usePoolFilters } from './PoolsFiltersProvider'

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
    cell: ({ row: { original } }) => original.strategy.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
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
    cell: (props) =>
      formatUSD(props.row.original.pool.liquidityUSD).includes('NaN')
        ? '$0.00'
        : formatUSD(props.row.original.pool.liquidityUSD),
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
        <span className="underline decoration-dotted">{formatPercent(props.row.original.pool.totalApr1d)}</span>
      </APRHoverCard>
    ),
    meta: {
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
        onSortingChange={setSorting}
        loading={!vaults && isValidatingVaults}
        columns={COLUMNS}
        data={_vaults}
      />
    </Card>
  )
}
