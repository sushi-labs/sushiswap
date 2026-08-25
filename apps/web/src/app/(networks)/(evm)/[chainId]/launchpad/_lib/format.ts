import { format } from 'date-fns'
import ms from 'ms'
import {
  formatPercent as formatPercentValue,
  formatUSD,
  shortenAddress,
} from 'sushi'
import { formatUnits } from 'viem'
import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'

export { shortenAddress }

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 5,
})

export function formatLaunchpadPriceUsd(
  value: number | null | undefined,
): string {
  return value === null || value === undefined || !Number.isFinite(value)
    ? '—'
    : priceFormatter.format(value)
}

export function formatUsd(
  value: number | null | undefined,
  inputString?: string,
): string {
  return value === null || value === undefined
    ? '—'
    : formatUSD(value, inputString)
}

export function formatUsdChange(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value > 0 ? '+' : ''}${formatUsd(value)}`
}

export function liquidityChange24hUsd({
  currentTvlUsd,
  tvlChangePercent24h,
  launchedAt,
}: {
  currentTvlUsd: number | null
  tvlChangePercent24h: number | null
  launchedAt: Date
}): number | null {
  if (currentTvlUsd === null) return null

  if (tvlChangePercent24h !== null) {
    const previousTvl = currentTvlUsd / (1 + tvlChangePercent24h / 100)
    return currentTvlUsd - previousTvl
  }

  const isNew = Date.now() - launchedAt.getTime() < ms('1d')
  return isNew ? currentTvlUsd : null
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value > 0 ? '+' : ''}${formatPercentValue(value / 100)}`
}

/**
 * Compact age for a launch, e.g. `now`, `11m`, `4h`, `3d`. Recomputed on each
 * render rather than ticking on a timer: the discovery grid already refetches
 * every 10s, and a per-card interval would not scale across the grid.
 */
export function formatLaunchpadAge(
  createdAt: string | number | Date,
  now: number = Date.now(),
): string {
  const timestamp = new Date(createdAt).getTime()
  if (!Number.isFinite(timestamp)) return '—'

  const elapsed = now - timestamp
  if (elapsed < ms('1m')) return 'now'
  if (elapsed < ms('1h')) return `${Math.floor(elapsed / ms('1m'))}m`
  if (elapsed < ms('1d')) return `${Math.floor(elapsed / ms('1h'))}h`
  if (elapsed < ms('365d')) return `${Math.floor(elapsed / ms('1d'))}d`
  return `${Math.floor(elapsed / ms('365d'))}y`
}

/** Accessible expansion of {@link formatLaunchpadAge}'s compact output. */
export function formatLaunchpadAgeLabel(age: string): string {
  return age === 'now' ? 'Launched just now' : `Launched ${age} ago`
}

export function formatRawAmount(
  value: string | bigint,
  decimals: number,
  maximumFractionDigits = 3,
): string {
  const [whole, fraction] = formatUnits(
    typeof value === 'bigint' ? value : BigInt(value),
    decimals,
  ).split('.')
  const formattedFraction = fraction
    ?.slice(0, maximumFractionDigits)
    .replace(/0+$/, '')
  const formattedWhole = new Intl.NumberFormat('en-US').format(BigInt(whole))

  return formattedFraction
    ? `${formattedWhole}.${formattedFraction}`
    : formattedWhole
}

export function getSelectedMetric(
  token: LaunchpadToken,
  sortBy: LaunchpadTokenSortField,
): { label: string; value: string; change?: number | null } {
  const metrics = token.metrics

  switch (sortBy) {
    case 'MARKET_CAPITALIZATION':
      return {
        label: 'Marketcap',
        value: formatUsd(metrics?.marketCapitalizationUsd),
      }
    case 'VOLUME_1H':
      return { label: '1h Vol', value: formatUsd(metrics?.volumeUsd.h1) }
    case 'VOLUME_6H':
      return { label: '6h Vol', value: formatUsd(metrics?.volumeUsd.h6) }
    case 'VOLUME_12H':
      return { label: '12h Vol', value: formatUsd(metrics?.volumeUsd.h12) }
    case 'VOLUME_24H':
      return { label: '24h Vol', value: formatUsd(metrics?.volumeUsd.h24) }
    case 'CURRENT_TVL':
      return { label: 'TVL', value: formatUsd(metrics?.currentTvlUsd) }
    case 'TVL_CHANGE_1H':
      return {
        label: 'TVL · 1h',
        value: formatPercent(metrics?.tvlChangePercent.h1),
        change: metrics?.tvlChangePercent.h1,
      }
    case 'TVL_CHANGE_6H':
      return {
        label: 'TVL · 6h',
        value: formatPercent(metrics?.tvlChangePercent.h6),
        change: metrics?.tvlChangePercent.h6,
      }
    case 'TVL_CHANGE_12H':
      return {
        label: 'TVL · 12h',
        value: formatPercent(metrics?.tvlChangePercent.h12),
        change: metrics?.tvlChangePercent.h12,
      }
    case 'TVL_CHANGE_24H':
      return {
        label: 'TVL · 24h',
        value: formatPercent(metrics?.tvlChangePercent.h24),
        change: metrics?.tvlChangePercent.h24,
      }
    case 'CREATED_AT':
      return {
        label: 'Launched',
        value: format(new Date(token.createdAt), 'MMM d'),
      }
  }

  return { label: 'Launched', value: '—' }
}
