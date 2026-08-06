import { createHash } from 'node:crypto'
import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import { formatUsd } from './format'

export interface LaunchpadCardStat {
  label: string
  value: string
}

export interface LaunchpadCardValues {
  marketCap: string
  name: string
  stats: LaunchpadCardStat[]
  symbol: string
}

/**
 * Everything the token card prints, in one place, so the social image and the
 * cache-busting version in its URL can never disagree.
 */
export function getLaunchpadCardValues(
  token: LaunchpadToken | null,
): LaunchpadCardValues {
  const metrics = token?.metrics

  return {
    marketCap: formatUsd(metrics?.marketCapitalizationUsd),
    name: token?.name || 'Sushi Launchpad token',
    stats: [
      { label: '24h volume', value: formatUsd(metrics?.volumeUsd.h24) },
      { label: 'Liquidity', value: formatUsd(metrics?.currentTvlUsd) },
    ],
    symbol: token?.symbol || 'TOKEN',
  }
}

/**
 * Short digest of the printed values. Social platforms cache a scraped image
 * for days keyed on its URL, so the URL has to change when the card does —
 * and only then, since every new version is a fresh render.
 */
export function getLaunchpadCardVersion(values: LaunchpadCardValues): string {
  const printed = [
    values.name,
    values.symbol,
    values.marketCap,
    ...values.stats.map((stat) => stat.value),
  ].join('|')

  return createHash('sha256').update(printed).digest('hex').slice(0, 12)
}
