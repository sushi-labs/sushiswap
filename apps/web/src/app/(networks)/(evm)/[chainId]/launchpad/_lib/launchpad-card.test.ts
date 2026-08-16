import { describe, expect, it } from 'vitest'
import {
  type LaunchpadCardValues,
  getLaunchpadCardVersion,
} from './launchpad-card'

const values: LaunchpadCardValues = {
  marketCap: '$4.82B',
  name: 'Onigiri',
  stats: [
    { label: '24h volume', value: '$1.24M' },
    { label: 'Liquidity', value: '$842.1K' },
  ],
  symbol: 'ONGR',
}

describe('getLaunchpadCardVersion', () => {
  it('is stable for the same printed values', () => {
    expect(getLaunchpadCardVersion(values)).toBe(
      getLaunchpadCardVersion({ ...values, stats: [...values.stats] }),
    )
  })

  it('changes when any printed value changes', () => {
    const version = getLaunchpadCardVersion(values)

    expect(
      getLaunchpadCardVersion({ ...values, marketCap: '$4.83M' }),
    ).not.toBe(version)
    expect(getLaunchpadCardVersion({ ...values, name: 'Onigiri 2' })).not.toBe(
      version,
    )
    expect(getLaunchpadCardVersion({ ...values, symbol: 'ONGR2' })).not.toBe(
      version,
    )
    expect(
      getLaunchpadCardVersion({
        ...values,
        stats: [values.stats[0], { label: 'Liquidity', value: '$842.2K' }],
      }),
    ).not.toBe(version)
  })

  it('ignores stat labels, which never change on their own', () => {
    expect(
      getLaunchpadCardVersion({
        ...values,
        stats: values.stats.map((stat) => ({ ...stat, label: 'Renamed' })),
      }),
    ).toBe(getLaunchpadCardVersion(values))
  })

  it('stays short enough for a URL', () => {
    expect(getLaunchpadCardVersion(values)).toMatch(/^[0-9a-f]{12}$/)
  })
})
