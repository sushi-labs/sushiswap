import type { LaunchpadToken, LaunchpadTokenSortField } from '../types'

export function shortenAddress(address: string, size = 4): string {
  return `${address.slice(0, size + 2)}…${address.slice(-size)}`
}

export function formatUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'

  if (Math.abs(value) < 0.01) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 8 })}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Math.abs(value) >= 10_000 ? 'compact' : 'standard',
    maximumFractionDigits: Math.abs(value) >= 10_000 ? 2 : 2,
  }).format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatRawAmount(
  value: string,
  decimals: number,
  maximumFractionDigits = 3,
): string {
  const padded = value.padStart(decimals + 1, '0')
  const whole = padded.slice(0, -decimals)
  const fraction = padded
    .slice(-decimals)
    .slice(0, maximumFractionDigits)
    .replace(/0+$/, '')
  const formattedWhole = Number(whole).toLocaleString('en-US')
  return fraction ? `${formattedWhole}.${fraction}` : formattedWhole
}

export function getSelectedMetric(
  token: LaunchpadToken,
  sortBy: LaunchpadTokenSortField,
): { label: string; value: string; change?: number | null } {
  const metrics = token.metrics

  switch (sortBy) {
    case 'VOLUME_1H':
      return { label: '1h volume', value: formatUsd(metrics?.volumeUsd.h1) }
    case 'VOLUME_6H':
      return { label: '6h volume', value: formatUsd(metrics?.volumeUsd.h6) }
    case 'VOLUME_12H':
      return { label: '12h volume', value: formatUsd(metrics?.volumeUsd.h12) }
    case 'VOLUME_24H':
      return { label: '24h volume', value: formatUsd(metrics?.volumeUsd.h24) }
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
        value: new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(new Date(token.createdAt)),
      }
  }

  return { label: 'Launched', value: '—' }
}
