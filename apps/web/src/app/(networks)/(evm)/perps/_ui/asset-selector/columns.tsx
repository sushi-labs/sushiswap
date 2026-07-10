import { Chip, SkeletonText, classNames } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import {
  type PerpOrSpotAsset,
  currencyFormatter,
  formatPrice,
  getSignForValue,
  getTextColorClass,
  perpsNumberFormatter,
} from 'src/lib/perps'
import { formatPercent } from 'sushi'
import type { BasisTradeAsset } from './asset-list-provider'
import { FavoriteButton } from './favorite-button'

type AssetSelectorColumnRow = PerpOrSpotAsset | BasisTradeAsset

const columnBodyMeta = {
  className: '!py-0.5 !pr-1 !pl-2.5 !h-[25px] !max-h-[25px] !text-xs',
  skeleton: (
    <>
      <div className="w-[80px]">
        <SkeletonText fontSize="lg" />
      </div>
    </>
  ),
}

function isBasisTradeAsset(
  asset: AssetSelectorColumnRow,
): asset is BasisTradeAsset {
  return 'spotAsset' in asset && 'perpAsset' in asset
}

function getStatsAsset(asset: AssetSelectorColumnRow): PerpOrSpotAsset {
  return isBasisTradeAsset(asset) ? asset.perpAsset : asset
}

function getMarketCapAsset(asset: AssetSelectorColumnRow): PerpOrSpotAsset {
  return isBasisTradeAsset(asset) ? asset.spotAsset : asset
}

function getSymbolAccessorValue(asset: AssetSelectorColumnRow): string {
  if (!isBasisTradeAsset(asset)) return asset.symbol

  return `${asset.spotAsset.symbol} ${asset.perpAsset.symbol} ${asset.perpAsset.dex}`
}

function renderSymbolCell(asset: AssetSelectorColumnRow) {
  if (isBasisTradeAsset(asset)) {
    const { perpAsset, spotAsset } = asset

    return (
      <div className="whitespace-nowrap flex items-center gap-1 pb-1 lg:pb-0 !min-w-[260px]">
        <div className="flex items-center gap-1">
          <span>{spotAsset.symbol}</span>
          <span className="text-muted-foreground">/</span>
          <span>{perpAsset.symbol}</span>
        </div>
        <div className="flex items-center gap-1">
          <Chip variant="perps-blue" className="!px-1 !font-medium">
            SPOT
          </Chip>
          <Chip variant="perps-blue" className="!px-1 !font-medium">
            {`${perpAsset.maxLeverage}x`}
          </Chip>
          {perpAsset.dex ? (
            <Chip variant="perps-blue" className="!px-1 !py-0 rounded-md ml-1">
              {perpAsset.dex}
            </Chip>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'whitespace-nowrap flex items-center gap-1 pb-1 lg:pb-0',
        asset?.marketType === 'perp' ? '!min-w-[215px]' : '',
      )}
    >
      <div className="flex items-center gap-1">
        <FavoriteButton assetString={asset.name} />
        <span>{asset.symbol}</span>
      </div>
      <div className="flex items-center gap-1">
        <Chip variant="perps-blue" className="!px-1 !font-medium">
          {asset.maxLeverage ? `${asset.maxLeverage}x` : 'SPOT'}
        </Chip>
        {asset?.dex ? (
          <Chip variant="perps-blue" className="!px-1 !py-0 rounded-md ml-1">
            {asset.dex}
          </Chip>
        ) : null}
      </div>
    </div>
  )
}

function createSymbolColumn<TRow extends AssetSelectorColumnRow>(): ColumnDef<
  TRow,
  unknown
> {
  return {
    id: 'symbol',
    header: 'Symbol',
    accessorFn: (row) => getSymbolAccessorValue(row),
    cell: (props) => renderSymbolCell(props.row.original),
    meta: {
      body: {
        className: classNames(columnBodyMeta.className, '!pl-0'),
        skeleton: columnBodyMeta.skeleton,
      },
      header: {
        className: '!pl-2',
      },
    },
  }
}

function createLastPriceColumn<
  TRow extends AssetSelectorColumnRow,
>(): ColumnDef<TRow, unknown> {
  return {
    id: 'lastPrice',
    header: 'Last Price',
    accessorFn: (row) => getStatsAsset(row).lastPrice,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getStatsAsset(rowA).lastPrice) -
      Number.parseFloat(getStatsAsset(rowB).lastPrice),
    cell: (props) => {
      const token = getStatsAsset(props.row.original)
      const price = token.lastPrice

      return (
        <div className="tabular-nums">
          {formatPrice(
            price?.toString() ?? '',
            token?.decimals ?? 0,
            token.marketType,
          )}
        </div>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }
}

function createDayChangeColumn<
  TRow extends AssetSelectorColumnRow,
>(): ColumnDef<TRow, unknown> {
  return {
    id: 'change24hPct',
    header: '24H Change',
    accessorFn: (row) => getStatsAsset(row).change24hPct,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getStatsAsset(rowA).change24hPct ?? '0') -
      Number.parseFloat(getStatsAsset(rowB).change24hPct ?? '0'),
    cell: (props) => {
      const asset = getStatsAsset(props.row.original)
      const change24hAbs = asset.change24hAbs
      const change24hPct = asset.change24hPct

      return (
        <p
          className={classNames(
            'text-xs whitespace-nowrap tabular-nums',
            change24hAbs && getTextColorClass(Number(change24hAbs)),
          )}
        >
          {getSignForValue(Number(change24hAbs ?? 0))}
          {perpsNumberFormatter({
            value: Number(change24hAbs ?? 0),
            maxFraxDigits: 4,
          })}{' '}
          / {getSignForValue(Number(change24hPct ?? 0))}
          {formatPercent(change24hPct)}
        </p>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }
}

function createEightHourFundingColumn<
  TRow extends AssetSelectorColumnRow,
>(): ColumnDef<TRow, unknown> {
  return {
    id: 'funding8hPct',
    header: '8H Funding',
    accessorFn: (row) => Number(getStatsAsset(row).funding8hPct || '0'),
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getStatsAsset(rowA).funding8hPct || '0') -
      Number.parseFloat(getStatsAsset(rowB).funding8hPct || '0'),
    cell: (props) => {
      const funding8h = getStatsAsset(props.row.original).funding8hPct

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
      body: columnBodyMeta,
    },
  }
}

function createVolumeColumn<TRow extends AssetSelectorColumnRow>(): ColumnDef<
  TRow,
  unknown
> {
  return {
    id: 'volume24hUsd',
    header: 'Volume',
    accessorFn: (row) => getStatsAsset(row).volume24hUsd,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getStatsAsset(rowA).volume24hUsd ?? '0') -
      Number.parseFloat(getStatsAsset(rowB).volume24hUsd ?? '0'),
    cell: (props) => (
      <div className="tabular-nums">
        {currencyFormatter.format(
          Number.parseFloat(
            getStatsAsset(props.row.original).volume24hUsd ?? '0',
          ),
        )}
      </div>
    ),
    meta: {
      body: columnBodyMeta,
    },
  }
}

function createOpenInterestColumn<
  TRow extends AssetSelectorColumnRow,
>(): ColumnDef<TRow, unknown> {
  return {
    id: 'openInterestUsd',
    header: 'Open Interest',
    accessorFn: (row) => getStatsAsset(row).openInterestUsd,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getStatsAsset(rowA).openInterestUsd ?? '0') -
      Number.parseFloat(getStatsAsset(rowB).openInterestUsd ?? '0'),
    cell: (props) => {
      const openInterestUsd = getStatsAsset(props.row.original).openInterestUsd

      if (!openInterestUsd) {
        return <div className="tabular-nums mx-4">--</div>
      }
      return (
        <div className="tabular-nums">
          {currencyFormatter.format(Number.parseFloat(openInterestUsd ?? '0'))}
        </div>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }
}

function createMarketCapColumn<
  TRow extends AssetSelectorColumnRow,
>(): ColumnDef<TRow, unknown> {
  return {
    id: 'marketCap',
    header: 'Market Cap',
    accessorFn: (row) => getMarketCapAsset(row).marketCap,
    sortingFn: ({ original: rowA }, { original: rowB }) =>
      Number.parseFloat(getMarketCapAsset(rowA).marketCap ?? '0') -
      Number.parseFloat(getMarketCapAsset(rowB).marketCap ?? '0'),
    cell: (props) => {
      const asset = getMarketCapAsset(props.row.original)
      const marketCap = asset.marketCap
      const token = asset.tokens?.[1]
      if (!marketCap) {
        return <div className="tabular-nums mr-4">--</div>
      }
      return (
        <div className="tabular-nums whitespace-nowrap !min-w-[210px]">
          {perpsNumberFormatter({
            value: marketCap ?? '0',
            maxFraxDigits: 2,
            minFraxDigits: 2,
          })}{' '}
          {token?.name}
        </div>
      )
    },
    meta: {
      body: columnBodyMeta,
    },
  }
}

export const SYMBOL_COLUMN = createSymbolColumn<PerpOrSpotAsset>()
export const LAST_PRICE_COLUMN = createLastPriceColumn<PerpOrSpotAsset>()
export const DAY_CHANGE_COLUMN = createDayChangeColumn<PerpOrSpotAsset>()
export const EIGHT_HOUR_FUNDING_COLUMN =
  createEightHourFundingColumn<PerpOrSpotAsset>()
export const VOLUME_COLUMN = createVolumeColumn<PerpOrSpotAsset>()
export const OPEN_INTEREST_COLUMN = createOpenInterestColumn<PerpOrSpotAsset>()
export const MARKET_CAP_COLUMN = createMarketCapColumn<PerpOrSpotAsset>()

export const BASIS_SYMBOL_COLUMN = createSymbolColumn<BasisTradeAsset>()
export const BASIS_LAST_PRICE_COLUMN = createLastPriceColumn<BasisTradeAsset>()
export const BASIS_DAY_CHANGE_COLUMN = createDayChangeColumn<BasisTradeAsset>()
export const BASIS_EIGHT_HOUR_FUNDING_COLUMN =
  createEightHourFundingColumn<BasisTradeAsset>()
export const BASIS_VOLUME_COLUMN = createVolumeColumn<BasisTradeAsset>()
export const BASIS_OPEN_INTEREST_COLUMN =
  createOpenInterestColumn<BasisTradeAsset>()
export const BASIS_MARKET_CAP_COLUMN = createMarketCapColumn<BasisTradeAsset>()
