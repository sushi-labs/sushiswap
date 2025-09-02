import type { Token } from '@sushiswap/graph-client/data-api'
import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { formatPercent, formatUSD } from 'sushi'
import { SparklineCell } from './sparkline-cell'
import { TokenNameCell } from './token-name-cell'

export const TOKENS_NAME_COLUMN: ColumnDef<Token, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <TokenNameCell {...props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
          </div>
          <SkeletonText />
        </div>
      ),
    },
  },
}

export const PRICE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.price,
  cell: (props) => (
    <span className="font-medium">{`${formatUSD(props.row.original.price)}`}</span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText />,
    },
  },
}

export const PRICE_CHANGE_1D_COLUMN: ColumnDef<Token, unknown> = {
  id: 'priceChangePercentage1d',
  header: '1 day',
  accessorFn: (row) => row.priceChangePercentage1d,
  cell: (props) => {
    const priceChangePercentage1d =
      props.row.original.priceChangePercentage1d ?? 0
    return (
      <span
        className={classNames(
          priceChangePercentage1d > 0
            ? 'text-green'
            : priceChangePercentage1d < 0
              ? 'text-red'
              : 'text-muted-foreground',
        )}
      >
        {priceChangePercentage1d > 0 ? '+' : ''}
        {formatPercent(priceChangePercentage1d / 100)}
      </span>
    )
  },
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}

export const FDV_COLUMN: ColumnDef<Token, unknown> = {
  id: 'marketCapUSD',
  header: 'FDV',
  accessorFn: (row) => row.marketCapUSD,
  cell: (props) => (
    <span className="font-medium">{`${formatUSD(props.row.original.marketCapUSD)}`}</span>
  ),
  meta: {
    header: {
      description:
        'Fully diluted valuation (FDV) calculates the total market value assuming all tokens are in circulation.',
    },
    body: {
      skeleton: <SkeletonText />,
    },
  },
}

export const SPARKLINE_COLUMN: ColumnDef<Token, unknown> = {
  id: 'sparkline',
  cell: (props) => (
    <SparklineCell
      data={useMemo(
        () => props.row.original.sparkline7d?.slice(-24) || [],
        [props.row.original.sparkline7d],
      )}
      width={120}
      height={40}
    />
  ),
  meta: {
    body: {
      skeleton: <SkeletonBox className="w-full h-10" />,
    },
  },
}
