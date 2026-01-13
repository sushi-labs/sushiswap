import { Chip, SkeletonText, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { PerpOrSpotAsset } from 'src/lib/perps/use-asset-list'
import {
  currencyFormatter,
  enUSFormatNumber,
  getSignForValue,
  getTextColorClass,
  numberFormatter,
} from 'src/lib/perps/utils'
import { formatPercent } from 'sushi'
import { FavoriteButton } from './favorite-button'

export const SYMBOL_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'symbol',
  header: 'Symbol',
  cell: (props) => {
    const asset = props.row.original
    return (
      <div className="whitespace-nowrap flex flex-col lg:flex-row lg:items-center gap-1">
        <div className="flex items-center gap-1">
          <FavoriteButton assetString={asset.symbol} />
          <span>{asset.symbol}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip variant="blue" className="!px-1 !font-medium">
            {asset.maxLeverage ? `${asset.maxLeverage}x` : 'SPOT'}
          </Chip>
          {asset?.dex ? (
            <Chip variant="blue" className="!px-1 !font-medium">
              {asset.dex}
            </Chip>
          ) : null}
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const LAST_PRICE_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'lastPrice',
  header: 'Last Price',
  accessorFn: (row) => row.lastPrice,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.lastPrice) - Number.parseFloat(rowB.lastPrice),
  cell: (props) => {
    const token = props.row.original
    const price =
      token.marketType === 'perp'
        ? token.lastPrice
        : (token.midPrice ?? token.markPrice)
    return (
      <div className="tabular-nums">
        {numberFormatter.format(Number.parseFloat(price ?? '0'))}
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const DAY_CHANGE_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'change24hPct',
  header: '24H Change',
  accessorFn: (row) => row.change24hPct,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.change24hPct ?? '0') -
    Number.parseFloat(rowB.change24hPct ?? '0'),
  cell: (props) => {
    const change24hAbs = props.row.original.change24hAbs
    const change24hPct = props.row.original.change24hPct
    return (
      <p
        className={classNames(
          'text-sm whitespace-nowrap tabular-nums',
          change24hAbs && getTextColorClass(Number(change24hAbs)),
        )}
      >
        {getSignForValue(Number(change24hAbs ?? 0))}
        {numberFormatter.format(Number(change24hAbs ?? 0))} /{' '}
        {getSignForValue(Number(change24hPct ?? 0))}
        {formatPercent(change24hPct)}
      </p>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const EIGHT_HOUR_FUNDING_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'funding8hPct',
  header: '8H Funding',
  accessorFn: (row) => row.funding8hPct,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.funding8hPct ?? '0') -
    Number.parseFloat(rowB.funding8hPct ?? '0'),
  cell: (props) => {
    const funding8h = props.row.original.funding8hPct

    if (!funding8h) {
      return <div className="tabular-nums">--</div>
    }
    return (
      <div className="tabular-nums">
        {(Number(funding8h ?? 0) * 100).toFixed(4)}%
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}

export const VOLUME_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'volume24hUsd',
  header: 'Volume',
  accessorFn: (row) => row.volume24hUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.volume24hUsd ?? '0') -
    Number.parseFloat(rowB.volume24hUsd ?? '0'),
  cell: (props) => (
    <div className="tabular-nums">
      {currencyFormatter.format(
        Number.parseFloat(props.row.original.volume24hUsd ?? '0'),
      )}
    </div>
  ),
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const OPEN_INTEREST_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'openInterestUsd',
  header: 'Open Interest',
  accessorFn: (row) => row.openInterestUsd,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.openInterestUsd ?? '0') -
    Number.parseFloat(rowB.openInterestUsd ?? '0'),
  cell: (props) => {
    const openInterestUsd = props.row.original.openInterestUsd

    if (!openInterestUsd) {
      return <div className="tabular-nums">--</div>
    }
    return (
      <div className="tabular-nums">
        {currencyFormatter.format(Number.parseFloat(openInterestUsd ?? '0'))}
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
export const MARKET_CAP_COLUMN: ColumnDef<PerpOrSpotAsset, unknown> = {
  id: 'marketCap',
  header: 'Market Cap',
  accessorFn: (row) => row.marketCap,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.marketCap ?? '0') -
    Number.parseFloat(rowB.marketCap ?? '0'),
  cell: (props) => {
    const marketCap = props.row.original.marketCap
    const token = props.row.original.tokens?.[1]
    if (!marketCap) {
      return <div className="tabular-nums">--</div>
    }
    return (
      <div className="tabular-nums whitespace-nowrap">
        {enUSFormatNumber.format(Number.parseFloat(marketCap ?? '0'))}{' '}
        {token?.name}
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="w-full max-w-[70px]">
          <SkeletonText fontSize="lg" />
        </div>
      ),
    },
  },
}
