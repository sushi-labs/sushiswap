import { type ExploreToken } from '@sushiswap/graph-client/data-api'
import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { formatNumber, formatPercent } from 'sushi/format'
import { SparklineCell } from './SparklineCell'
import { TokenNameCell } from './TokenNameCell'

export const TOKENS_NAME_COLUMN: ColumnDef<ExploreToken, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => <TokenNameCell {...props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={40} />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

export const PRICE_COLUMN: ColumnDef<ExploreToken, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.price ?? 0,
  cell: (props) => `$${formatNumber(props.row.original.price || 0)}`,
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const FDV_COLUMN: ColumnDef<ExploreToken, unknown> = {
  id: 'marketCapUSD',
  header: 'FDV',
  accessorFn: (row) => row.marketCapUSD ?? 0,
  cell: (props) => `$${formatNumber(props.row.original.marketCapUSD || 0)}`,
  meta: {
    headerDescription:
      'Fully diluted valuation (FDV) calculates the total market value assuming all tokens are in circulation.',
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const PRICE_CHANGE_1D_COLUMN: ColumnDef<ExploreToken, unknown> = {
  id: 'priceChangePercentage1d',
  header: 'Price (1d)',
  accessorFn: (row) => row.priceChangePercentage1d ?? 0,
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
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

export const SPARKLINE_COLUMN: ColumnDef<ExploreToken, unknown> = {
  id: 'sparkline',
  header: '',
  cell: (props) => (
    <SparklineCell data={props.row.original.sparkline7d?.slice(-24) || []} />
  ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
