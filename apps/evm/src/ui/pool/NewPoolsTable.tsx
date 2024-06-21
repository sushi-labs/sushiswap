'use client'

import { Slot } from '@radix-ui/react-slot'
import { PoolsV1 } from '@sushiswap/graph-client/data-api'

import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  Currency,
  DataTable,
  NetworkIcon,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@sushiswap/ui'
import { ColumnDef, Row, SortingState, TableState } from '@tanstack/react-table'
import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { ChainId } from 'sushi/chain'
import { formatNumber, formatUSD } from 'sushi/format'
import { SushiSwapProtocol } from 'sushi/types'
import { ProtocolBadge } from './PoolNameCell'
import {
  APR_COLUMN,
  FEES_COLUMN,
  TVL_COLUMN,
  VOLUME_1D_COLUMN,
  VOLUME_1M_COLUMN,
  VOLUME_1W_COLUMN,
} from './columns'

const COLUMNS = [
  {
    id: 'name',
    header: 'Name',

    cell: (props) => {
      const { data: token0, isLoading: isToken0Loading } = useTokenWithCache({
        chainId: props.row.original.chainId as ChainId,
        address: props.row.original.token0Address,
      })

      const { data: token1, isLoading: isToken1Loading } = useTokenWithCache({
        chainId: props.row.original.chainId as ChainId,
        address: props.row.original.token1Address,
      })

      return isToken0Loading || isToken1Loading ? (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="flex min-w-[54px]">
            {token0 && token1 ? (
              <Badge
                className="border-2 border-slate-900 rounded-full z-[11]"
                position="bottom-right"
                badgeContent={
                  <NetworkIcon
                    chainId={props.row.original.chainId as ChainId}
                    width={14}
                    height={14}
                  />
                }
              >
                <Currency.IconList iconWidth={26} iconHeight={26}>
                  <Currency.Icon disableLink currency={token0} />
                  <Currency.Icon disableLink currency={token1} />
                </Currency.IconList>
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
              {token0?.symbol}{' '}
              <span className="font-normal text-gray-900 dark:text-slate-500">
                /
              </span>{' '}
              {token1?.symbol}{' '}
              <div
                className={
                  'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1'
                }
              />
            </span>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {
                      ProtocolBadge[
                        props.row.original.protocol as SushiSwapProtocol
                      ]
                    }
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Protocol version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] px-2 rounded-full">
                      {formatNumber(props.row.original.swapFee * 100)}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Swap fee</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {props.row.original.isIncentivized && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
                        🧑‍🌾{' '}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Farm rewards available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {props.row.original.isSmartPool && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-[#F2E9D6] dark:bg-yellow/60 text-[10px] px-2 rounded-full">
                        💡
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Smart Pool available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      )
    },
    size: 300,
  },
  TVL_COLUMN,
  {
    id: 'volumeUSD1h',
    header: 'Volume (60min)',
    accessorFn: (row) => row.volumeUSD1h,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      rowA.volumeUSD1h - rowB.volumeUSD1h,
    cell: (props) =>
      formatUSD(props.row.original.volumeUSD1h).includes('NaN')
        ? '$0.00'
        : formatUSD(props.row.original.volumeUSD1h),
  },
  VOLUME_1D_COLUMN,
  {
    id: 'feeUSD1h',
    header: 'Fees (60min)',
    accessorFn: (row) => row.feeUSD1h,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      rowA.feeUSD1h - rowB.feeUSD1h,
    cell: (props) =>
      formatUSD(props.row.original.feeUSD1h).includes('NaN')
        ? '$0.00'
        : formatUSD(props.row.original.feeUSD1h),
  },
  {
    id: 'feeUSD1d',
    header: 'Fees (24h)',
    accessorFn: (row) => row.feeUSD1d,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      rowA.feeUSD1d - rowB.feeUSD1d,
    cell: (props) =>
      formatUSD(props.row.original.feeUSD1d).includes('NaN')
        ? '$0.00'
        : formatUSD(props.row.original.feeUSD1d),
  },
  APR_COLUMN,
] as ColumnDef<PoolsV1[number], unknown>[]

interface PositionsTableProps {
  pools: PoolsV1
  onRowClick?(row: PoolsV1[number]): void
}

export const NewPoolsTable: FC<PositionsTableProps> = ({
  pools,
  onRowClick,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'liquidityUSD', desc: true },
  ])

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
    (row: Row<PoolsV1[number]>, rowNode: ReactNode) => {
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
    <Card>
      <CardHeader>
        <CardTitle>
          Pools{' '}
          {pools.length ? (
            <span className="text-gray-400 dark:text-slate-500">
              ({pools.length})
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <DataTable
        state={state}
        onSortingChange={setSorting}
        loading={!pools}
        linkFormatter={(row) => `/pool/${row.chainId}%3A${row.address}`}
        rowRenderer={rowRenderer}
        columns={COLUMNS}
        data={data}
      />
    </Card>
  )
}
