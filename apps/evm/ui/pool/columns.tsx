import { Pool } from '@sushiswap/client'
import { formatNumber, formatPercent, formatUSD, shortenAddress } from 'sushi'
import { AngleRewardsPool } from '@sushiswap/react-query'
import { classNames, NetworkIcon, Tooltip, TooltipPrimitive, TooltipProvider, TooltipTrigger } from '@sushiswap/ui'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import { ConcentratedLiquidityPositionWithV3Pool } from '@sushiswap/wagmi/future'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistance } from 'date-fns'
import React from 'react'

import { PositionWithPool } from '../../types'
import { APRHoverCard } from './APRHoverCard'
import { ConcentratedLiquidityPositionAPRCell } from './ConcentratedLiquidityPositionAPRCell'
import { PoolNameCell, PoolNameCellPool } from './PoolNameCell'
import { PoolNameCellV3 } from './PoolNameCellV3'
import { Transaction, TransactionType, useTransactionsV2 } from './PoolTransactionsV2'
import { TransactionTypeV3, TransactionV3, useTransactionsV3 } from './PoolTransactionsV3'
import { PriceRangeCell } from './PriceRangeCell'
import { RewardsV3ClaimableCell } from './RewardsV3ClaimableCell'
import { RewardsV3NameCell } from './RewardsV3NameCell'

export const REWARDS_V3_NAME_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'poolName',
  header: 'Pool',
  cell: (props) => <RewardsV3NameCell {...props.row} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={40} />
          <SkeletonCircle radius={40} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

export const REWARDS_V3_POSITION_SIZE_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'positionSize',
  header: 'Position Size',
  accessorFn: (row) => row.userTVL ?? 0,
  cell: (props) => `$${formatNumber(props.row.original.userTVL)}`,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const REWARDS_V3_APR_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'apr',
  header: 'APR',
  accessorFn: (row) => row.meanAPR ?? 0,
  cell: (props) => (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted flex items-center justify-end gap-1 text-sm text-gray-900 dark:text-slate-50">
            {formatNumber(props.row.original.meanAPR)}%
          </span>
        </TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className={classNames(
              'border border-accent max-h-[var(--radix-popper-available-height)] z-50 w-72 bg-white/50 dark:bg-slate-800/50 paper rounded-xl p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            {...props}
          >
            The APR displayed is algorithmic and subject to change..
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const REWARDS_V3_CLAIMABLE_COLUMN: ColumnDef<AngleRewardsPool, unknown> = {
  id: 'claimable',
  header: 'Claimable',
  accessorFn: (row) => row.userTVL ?? 0,
  cell: (props) => <RewardsV3ClaimableCell {...props.row} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const NETWORK_COLUMN_POOL: ColumnDef<Pool, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <NetworkIcon type="naked" chainId={props.row.original.chainId} width={26} height={26} />,
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_COLUMN_POOL: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCellPool {...props.row} />,
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
}

export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  cell: (props) =>
    formatUSD(props.row.original.liquidityUSD).includes('NaN') ? '$0.00' : formatUSD(props.row.original.liquidityUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const APR_COLUMN_POOL: ColumnDef<Pool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => (
    <APRHoverCard pool={props.row.original}>
      <span className="underline decoration-dotted">{formatPercent(props.row.original.totalApr1d)}</span>
    </APRHoverCard>
  ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1H_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1h',
  header: 'Volume (1h)',
  accessorFn: (row) => row.volume1h,
  cell: (props) =>
    formatUSD(props.row.original.volume1h).includes('NaN') ? '$0.00' : formatUSD(props.row.original.volume1h),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volume1d,
  cell: (props) =>
    formatUSD(props.row.original.volume1d).includes('NaN') ? '$0.00' : formatUSD(props.row.original.volume1d),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_7D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1w',
  header: 'Volume (1w)',
  accessorFn: (row) => row.volume1w,
  cell: (props) =>
    formatUSD(props.row.original.volume1w).includes('NaN') ? '$0.00' : formatUSD(props.row.original.volume1w),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_1M_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volume1m',
  header: 'Volume (1m)',
  accessorFn: (row) => row.volume1m,
  cell: (props) =>
    formatUSD(props.row.original.volume1m).includes('NaN') ? '$0.00' : formatUSD(props.row.original.volume1m),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const FEES_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'fees1d',
  header: 'Fees (24h)',
  accessorFn: (row) => row.fees1d,
  cell: (props) =>
    formatUSD(props.row.original.fees1d).includes('NaN') ? '$0.00' : formatUSD(props.row.original.fees1d),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const NETWORK_COLUMN: ColumnDef<PositionWithPool, unknown> = {
  id: 'network',
  header: 'Network',
  cell: (props) => <NetworkIcon type="naked" chainId={props.row.original.chainId} width={26} height={26} />,
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_COLUMN_POSITION_WITH_POOL: ColumnDef<PositionWithPool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCell {...props.row} />,
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
}

export const APR_COLUMN: ColumnDef<PositionWithPool, unknown> = {
  id: 'apr',
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
}

export const VALUE_COLUMN: ColumnDef<PositionWithPool, unknown> = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) => (Number(row.balance) / Number(row.pool.totalSupply)) * Number(row.pool.liquidityUSD),
  cell: (props) =>
    formatUSD(
      (Number(props.row.original.balance) / Number(props.row.original.pool.totalSupply)) *
        Number(props.row.original.pool.liquidityUSD)
    ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const VOLUME_COLUMN: ColumnDef<PositionWithPool, unknown> = {
  id: 'volume',
  header: 'Volume (24h)',
  cell: (props) =>
    formatUSD(props.row.original.pool.volume1d).includes('NaN') ? '$0.00' : formatUSD(props.row.original.pool.volume1d),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const NAME_COLUMN_V3: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCellV3 {...props.row} />,
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
}

export const PRICE_RANGE_COLUMN: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <PriceRangeCell {...props.row} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const CLIQ_APR_COLUMN: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <ConcentratedLiquidityPositionAPRCell {...props.row} />,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const POSITION_SIZE_CELL: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'positionSize',
  accessorFn: (row) => +row.position.positionUSD,
  header: 'Position Size',
  cell: (props) => formatUSD(props.row.original.position.positionUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const POSITION_UNCLAIMED_CELL: ColumnDef<ConcentratedLiquidityPositionWithV3Pool, unknown> = {
  id: 'unclaimed',
  accessorFn: (row) => +row.position.unclaimedUSD,
  header: 'Unclaimed fees',
  cell: (props) => formatUSD(props.row.original.position.unclaimedUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_SENDER_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => shortenAddress(props.row.original.sender),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_AMOUNT_IN_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type']
): ColumnDef<Transaction, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionType.Swap ? 'Amount in' : 'Token 0',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return `${row.original.amountIn.toPrecision(2)} ${row.original.tokenIn.symbol}`
      case TransactionType.Mint:
      case TransactionType.Burn:
        return `${row.original.amount0.toPrecision(6)} ${row.original.pool.token0.symbol}`
    }
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
})

export const TX_AMOUNT_OUT_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type']
): ColumnDef<Transaction, unknown> => ({
  id: 'amount_out',
  header: type === TransactionType.Swap ? 'Amount out' : 'Token 1',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return `${Math.abs(row.original.amountOut).toFixed(2)} ${row.original.tokenOut.symbol}`
      case TransactionType.Mint:
      case TransactionType.Burn:
        return `${row.original.amount1.toFixed(2)} ${row.original.pool.token1.symbol}`
    }
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
})

export const TX_AMOUNT_USD_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => formatUSD(props.row.original.amountUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_CREATED_TIME_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) => formatDistance(props.row.original.createdAtTimestamp * 1000, new Date(), { addSuffix: true }),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_TYPE_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => TransactionType[props.row.original.type],
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_ORIGIN_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => shortenAddress(props.row.original.origin),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_AMOUNT_IN_V3_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type']
): ColumnDef<TransactionV3, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionTypeV3.Swap ? 'Amount in' : 'Token 0',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionTypeV3.Swap: {
        const amounts = row.amount0 < 0 ? [row.amount0, row.amount1] : [row.amount1, row.amount0]
        const tokens = row.amount0 < 0 ? [row.pool.token0, row.pool.token1] : [row.pool.token1, row.pool.token0]

        return `${Math.abs(amounts[0]).toPrecision(6)} ${tokens[0].symbol}`
      }
      case TransactionTypeV3.Mint:
      case TransactionTypeV3.Burn:
      case TransactionTypeV3.Collect:
        return `${row.amount0.toPrecision(6)} ${row.pool.token0.symbol}`
    }
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
})

export const TX_AMOUNT_OUT_V3_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type']
): ColumnDef<TransactionV3, unknown> => ({
  id: 'amount_out',
  header: type === TransactionTypeV3.Swap ? 'Amount out' : 'Token 1',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionTypeV3.Swap: {
        const amounts = row.amount0 < 0 ? [row.amount0, row.amount1] : [row.amount1, row.amount0]
        const tokens = row.amount0 < 0 ? [row.pool.token0, row.pool.token1] : [row.pool.token1, row.pool.token0]

        return `${Math.abs(amounts[1]).toFixed(2)} ${tokens[1].symbol}`
      }
      case TransactionTypeV3.Mint:
      case TransactionTypeV3.Burn:
      case TransactionTypeV3.Collect:
        return `${row.amount1.toFixed(2)} ${row.pool.token1.symbol}`
    }
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
})

export const TX_AMOUNT_USD_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => formatUSD(props.row.original.amountUSD),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const TX_TIME_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) => formatDistance(props.row.original.timestamp * 1000, new Date(), { addSuffix: true }),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
