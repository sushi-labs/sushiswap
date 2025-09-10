import type { Pool } from '@sushiswap/graph-client/data-api'
import {
  Badge,
  Currency,
  FormattedNumber,
  SkeletonBox,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ColumnDef } from '@tanstack/react-table'
import formatDistance from 'date-fns/formatDistance'
import React, { useMemo } from 'react'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { formatNumber, formatPercent, formatUSD } from 'sushi'
import {
  EvmToken,
  type MaybeNestedPool,
  type PoolBase,
  type PoolIfIncentivized,
  type PoolWithAprs,
  type PoolWithIncentives,
  type SushiPositionStaked,
  type SushiPositionWithPool,
  type SushiSwapProtocol,
  SushiSwapV3ChainId,
  shortenEvmAddress,
  unnestPool,
} from 'sushi/evm'
import { APRHoverCard } from './APRHoverCard'
import { APRWithRewardsHoverCard } from './APRWithRewardsHoverCard'
import { ClaimableFeesActionCell } from './ClaimableFeesActionCell'
import { ClaimableFeesAmountCell } from './ClaimableFeesAmountCell'
import { ClaimableFeesChainCell } from './ClaimableFeesChainCell'
import type { ClaimableFees } from './ClaimableFeesTab'
import { ClaimableRewardsActionCell } from './ClaimableRewardsActionCell'
import { ClaimableRewardsAmountCell } from './ClaimableRewardsAmountCell'
import { ClaimableRewardsChainCell } from './ClaimableRewardsChainCell'
import { ConcentratedLiquidityPositionAPRCell } from './ConcentratedLiquidityPositionAPRCell'
import { PoolNameCell, ProtocolBadge } from './PoolNameCell'
import { PoolNameCellV3 } from './PoolNameCellV3'
import {
  type Transaction,
  TransactionType,
  type useTransactionsV2,
} from './PoolTransactionsV2'
import {
  TransactionTypeV3,
  type TransactionV3,
  type useTransactionsV3,
} from './PoolTransactionsV3'
import { PriceRangeCell } from './PriceRangeCell'

export const REWARDS_CHAIN_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: (props) => <ClaimableRewardsChainCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-2 items-center w-full">
          <SkeletonCircle radius={18} />
          <div className="w-28">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      ),
    },
  },
}

export const REWARDS_AMOUNT_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'amount',
  header: 'Rewards Amount',
  cell: (props) => <ClaimableRewardsAmountCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="w-24">
          <SkeletonText fontSize="sm" />
        </div>
      ),
    },
  },
}

export const REWARDS_ACTION_COLUMN: ColumnDef<ClaimableRewards, unknown> = {
  id: 'action',
  header: 'Action',
  cell: (props) => <ClaimableRewardsActionCell {...props.row} />,
  size: 280,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-3 w-[280px]">
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-10 w-full" />
        </div>
      ),
    },
  },
}

export const FEES_CHAIN_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'chain',
  header: 'Chain',
  cell: (props) => <ClaimableFeesChainCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-2 items-center w-full">
          <SkeletonCircle radius={18} />
          <div className="w-28">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      ),
    },
  },
}

export const FEES_AMOUNT_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'amount',
  header: 'Fees Amount',
  cell: (props) => <ClaimableFeesAmountCell {...props.row} />,
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="w-24">
          <SkeletonText fontSize="sm" />
        </div>
      ),
    },
  },
}

export const FEES_ACTION_COLUMN: ColumnDef<ClaimableFees, unknown> = {
  id: 'action',
  header: 'Action',
  cell: (props) => <ClaimableFeesActionCell {...props.row} />,
  size: 280,
  meta: {
    body: {
      skeleton: (
        <div className="flex gap-3 w-[280px]">
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-10 w-full" />
        </div>
      ),
    },
  },
}

export const NAME_COLUMN_POOL: ColumnDef<
  MaybeNestedPool<PoolIfIncentivized<PoolBase, true>>,
  unknown
> = {
  id: 'name',
  header: 'Name',

  cell: (props) => <PoolNameCell pool={unnestPool(props.row.original)} />,
  meta: {
    body: {
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
  },
  size: 300,
}

export const EXPLORE_NAME_COLUMN_POOL: ColumnDef<Pool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => {
    const [token0, token1] = useMemo(
      () => [
        new EvmToken({
          name: '',
          symbol: '',
          chainId: props.row.original.chainId,
          address: props.row.original.token0Address,
          decimals: 0,
        }),
        new EvmToken({
          name: '',
          symbol: '',
          chainId: props.row.original.chainId,
          address: props.row.original.token1Address,
          decimals: 0,
        }),
      ],
      [props.row.original],
    )

    return (
      <div className="flex items-center gap-5">
        <div className="flex min-w-[54px]">
          {token0 && token1 ? (
            <Badge
              className="border-2 border-slate-900 rounded-full z-[11]"
              position="bottom-right"
              badgeContent={
                <NetworkIcon
                  chainId={props.row.original.chainId}
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
          <span className="flex items-center gap-1 pr-2 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
            {props.row.original.name}
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
          </div>
        </div>
      </div>
    )
  },
  size: 300,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={30} />
            <SkeletonCircle radius={30} className="-ml-[10px]" />
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  accessorFn: (row) => row.liquidityUSD,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.liquidityUSD - rowB.liquidityUSD,
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.liquidityUSD).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.liquidityUSD)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.liquidityUSDChange1d > 0
            ? 'text-green'
            : props.row.original.liquidityUSDChange1d < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.liquidityUSDChange1d > 0 ? '+' : ''}
        {formatPercent(props.row.original.liquidityUSDChange1d)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (24h)',
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.volumeUSD1d - rowB.volumeUSD1d,
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.volumeUSD1d).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1d)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.volumeUSDChange1d > 0
            ? 'text-green'
            : props.row.original.volumeUSDChange1d < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.volumeUSDChange1d > 0 ? '+' : ''}
        {formatPercent(props.row.original.volumeUSDChange1d)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const VOLUME_1W_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'volumeUSD1w',
  header: 'Volume (1w)',
  accessorFn: (row) => row.volumeUSD1w,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.volumeUSD1w) - Number(rowB.volumeUSD1w),
  cell: (props) => (
    <div className="flex flex-col">
      <span>
        {formatUSD(props.row.original.volumeUSD1w).includes('NaN')
          ? '$0.00'
          : formatUSD(props.row.original.volumeUSD1w)}
      </span>
      <span
        className={classNames(
          'text-xs',
          props.row.original.volumeUSDChange1w > 0
            ? 'text-green'
            : props.row.original.volumeUSDChange1w < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {props.row.original.volumeUSDChange1w > 0 ? '+' : ''}
        {formatPercent(props.row.original.volumeUSDChange1w)}
      </span>
    </div>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TRANSACTIONS_1D_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'txCount1d',
  header: 'Transactions (24h)',
  accessorFn: (row) => row.txCount1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    rowA.txCount1d - rowB.txCount1d,
  cell: (props) => props.row.original.txCount1d,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const APR_WITH_REWARDS_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => row.totalApr1d,
  cell: (props) => (
    <APRWithRewardsHoverCard pool={props.row.original}>
      <div className="flex items-center gap-1">
        <span
          className={classNames(
            'underline decoration-dotted underline-offset-2',
          )}
        >
          {formatPercent(props.row.original.totalApr1d)}
        </span>
        {props.row.original.incentives.map((incentive) => (
          <Currency.Icon
            key={incentive.id}
            width={16}
            height={16}
            currency={incentive.rewardToken}
          />
        ))}
      </div>
    </APRWithRewardsHoverCard>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
    disableLink: true,
  },
}

export const APR_COLUMN = {
  id: 'totalApr1d',
  header: 'APR',
  accessorFn: (row) => unnestPool(row).totalApr1d,
  cell: (props) => (
    <APRHoverCard pool={unnestPool(props.row.original)}>
      <span
        className={classNames('underline decoration-dotted underline-offset-2')}
      >
        {formatPercent(unnestPool(props.row.original).totalApr1d)}
      </span>
    </APRHoverCard>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
} as const satisfies ColumnDef<
  MaybeNestedPool<PoolWithIncentives<PoolWithAprs>>,
  unknown
>

export const VALUE_COLUMN = {
  id: 'value',
  header: 'Value',
  accessorFn: (row) =>
    (Number(row.unstakedBalance + row.stakedBalance) /
      Number(row.pool.liquidity)) *
    Number(row.pool.liquidityUSD),
  cell: ({ row: { original } }) => (
    <span>
      {formatUSD(
        (Number(original.unstakedBalance + original.stakedBalance) /
          Number(original.pool.liquidity)) *
          Number(original.pool.liquidityUSD),
      )}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
} as const satisfies ColumnDef<
  SushiPositionWithPool<PoolBase, SushiPositionStaked>,
  unknown
>

export const NAME_COLUMN_V3: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <PoolNameCellV3 {...props.row} />,
  meta: {
    body: {
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
  },
}

export const PRICE_RANGE_COLUMN: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <PriceRangeCell {...props.row} />,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const CLIQ_APR_COLUMN: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'priceRange',
  header: 'Price Range',
  cell: (props) => <ConcentratedLiquidityPositionAPRCell {...props.row} />,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const POSITION_SIZE_CELL: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'positionSize',
  accessorFn: (row) => +row.position.positionUSD,
  header: 'Position Size',
  cell: (props) => formatUSD(props.row.original.position.positionUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const POSITION_UNCLAIMED_CELL: ColumnDef<
  ConcentratedLiquidityPositionWithV3Pool,
  unknown
> = {
  id: 'unclaimed',
  accessorFn: (row) => +row.position.unclaimedUSD,
  header: 'Unclaimed fees',
  cell: (props) => formatUSD(props.row.original.position.unclaimedUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_SENDER_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => shortenEvmAddress(props.row.original.sender),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_AMOUNT_IN_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type'],
): ColumnDef<Transaction, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionType.Swap ? 'Amount in' : 'Token 0',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return (
          <span>
            <FormattedNumber
              number={
                row.original.amount0In !== '0'
                  ? row.original.amount0In
                  : row.original.amount1In
              }
            />{' '}
            {row.original.amount0In !== '0'
              ? row.original.symbol0
              : row.original.symbol1}
          </span>
        )
      case TransactionType.Mint:
      case TransactionType.Burn:
        return (
          <span>
            <FormattedNumber number={row.original.amount0.toPrecision(6)} />{' '}
            {row.original.symbol0}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_OUT_V2_COLUMN = (
  type: Parameters<typeof useTransactionsV2>['2']['type'],
): ColumnDef<Transaction, unknown> => ({
  id: 'amount_out',
  header: type === TransactionType.Swap ? 'Amount out' : 'Token 1',
  cell: ({ row }) => {
    switch (row.original.type) {
      case TransactionType.Swap:
        return (
          <span>
            <FormattedNumber
              number={Math.abs(
                row.original.amount0Out !== '0'
                  ? Number(row.original.amount0Out)
                  : Number(row.original.amount1Out),
              ).toPrecision(2)}
            />{' '}
            {row.original.amount0Out !== '0'
              ? row.original.symbol0
              : row.original.symbol1}
          </span>
        )
      case TransactionType.Mint:
      case TransactionType.Burn:
        return (
          <span>
            <FormattedNumber number={row.original.amount1.toPrecision(2)} />{' '}
            {row.original.symbol1}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_USD_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => formatUSD(props.row.original.amountUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_CREATED_TIME_V2_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) =>
    formatDistance(props.row.original.createdAtTimestamp * 1000, new Date(), {
      addSuffix: true,
    }),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_TYPE_COLUMN: ColumnDef<Transaction, unknown> = {
  id: 'type',
  header: 'Type',
  cell: (props) => TransactionType[props.row.original.type],
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_ORIGIN_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'sender',
  header: 'Maker',
  cell: (props) => shortenEvmAddress(props.row.original.origin),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_AMOUNT_IN_V3_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type'],
): ColumnDef<TransactionV3, unknown> => ({
  id: 'amounts_in',
  header: type === TransactionTypeV3.Swap ? 'Amount in' : 'Token 0',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionTypeV3.Swap: {
        const amounts =
          row.amount0 < 0
            ? [row.amount0, row.amount1]
            : [row.amount1, row.amount0]
        const tokens =
          row.amount0 < 0
            ? [row.pool.token0, row.pool.token1]
            : [row.pool.token1, row.pool.token0]

        return (
          <span>
            <FormattedNumber number={Math.abs(amounts[0]).toPrecision(6)} />{' '}
            {tokens[0].symbol}
          </span>
        )
      }
      case TransactionTypeV3.Mint:
      case TransactionTypeV3.Burn:
      case TransactionTypeV3.Collect:
        return (
          <span>
            <FormattedNumber number={row.amount0.toPrecision(6)} />{' '}
            {row.pool.token0.symbol}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_OUT_V3_COLUMN = (
  type: Parameters<typeof useTransactionsV3>['2']['type'],
): ColumnDef<TransactionV3, unknown> => ({
  id: 'amount_out',
  header: type === TransactionTypeV3.Swap ? 'Amount out' : 'Token 1',
  cell: (props) => {
    const row = props.row.original
    switch (row.type) {
      case TransactionTypeV3.Swap: {
        const amounts =
          row.amount0 < 0
            ? [row.amount0, row.amount1]
            : [row.amount1, row.amount0]
        const tokens =
          row.amount0 < 0
            ? [row.pool.token0, row.pool.token1]
            : [row.pool.token1, row.pool.token0]

        return (
          <span>
            <FormattedNumber number={Math.abs(amounts[1]).toPrecision(2)} />{' '}
            {tokens[1].symbol}
          </span>
        )
      }
      case TransactionTypeV3.Mint:
      case TransactionTypeV3.Burn:
      case TransactionTypeV3.Collect:
        return (
          <span>
            <FormattedNumber number={row.amount1.toPrecision(2)} />{' '}
            {row.pool.token1.symbol}
          </span>
        )
    }
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
})

export const TX_AMOUNT_USD_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'amountUSD',
  header: 'Amount (USD)',
  cell: (props) => formatUSD(props.row.original.amountUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const TX_TIME_V3_COLUMN: ColumnDef<TransactionV3, unknown> = {
  id: 'time',
  header: 'Time',
  cell: (props) =>
    formatDistance(props.row.original.timestamp * 1000, new Date(), {
      addSuffix: true,
    }),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
