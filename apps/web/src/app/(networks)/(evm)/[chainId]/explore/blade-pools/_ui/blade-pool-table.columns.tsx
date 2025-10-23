import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  Currency,
  SkeletonCircle,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { CurrencyFiatIcon } from '@sushiswap/ui/icons/CurrencyFiatIcon'
import type { ColumnDef } from '@tanstack/react-table'
import {
  getPoolNameFromGroupedTokens,
  getPoolTokensGrouped,
} from 'src/lib/pool/blade'
import { formatPercent, formatUSD } from 'sushi'

export const NAME_COLUMN_POOL: ColumnDef<BladePool, unknown> = {
  id: 'name',
  header: 'Name',
  cell: (props) => {
    const meta = props.table.options.meta
    const showStableTypes = meta?.showStablecoinTypes ?? true
    const groupedTokens = getPoolTokensGrouped(props.row.original)
    const poolName = getPoolNameFromGroupedTokens(groupedTokens, {
      showStableTypes,
    })
    const { tokens, stablecoinUsdTokens } = groupedTokens
    const hasStablecoin = stablecoinUsdTokens.length > 0

    return (
      <div className="flex items-center gap-2">
        <div className="flex min-w-[54px]">
          <Currency.IconList iconWidth={26} iconHeight={26}>
            {tokens.map((token) => (
              <Currency.Icon
                key={token.wrap().address}
                disableLink
                currency={token}
              />
            ))}
            {hasStablecoin && !showStableTypes ? (
              <CurrencyFiatIcon />
            ) : (
              stablecoinUsdTokens.map((token) => (
                <Currency.Icon
                  key={token.wrap().address}
                  disableLink
                  currency={token}
                />
              ))
            )}
          </Currency.IconList>
        </div>
        <div>{poolName}</div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex w-full items-center gap-2">
          <div className="flex items-center">
            <SkeletonCircle radius={26} />
            <SkeletonCircle radius={26} className="-ml-[12px]" />
          </div>
          <div className="flex w-full flex-col">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
  size: 300,
}

export const TVL_COLUMN: ColumnDef<BladePool, unknown> = {
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

export const VOLUME_1W_COLUMN: ColumnDef<BladePool, unknown> = {
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

export const VOLUME_1D_COLUMN: ColumnDef<BladePool, unknown> = {
  id: 'volumeUSD1d',
  header: 'Volume (1d)',
  accessorFn: (row) => row.volumeUSD1d,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number(rowA.volumeUSD1d) - Number(rowB.volumeUSD1d),
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

export const APR_COLUMN: ColumnDef<BladePool, unknown> = {
  id: 'totalApr1d',
  header: 'APR',
  cell: (props) => (
    <span
      className={classNames('underline decoration-dotted underline-offset-2')}
    >
      {formatPercent(props.row.original.totalApr1d)}
    </span>
  ),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
}
