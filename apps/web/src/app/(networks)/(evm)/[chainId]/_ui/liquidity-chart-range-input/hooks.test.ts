import { describe, expect, it } from 'vitest'
import { getDensityChartData } from './hooks'

describe('getDensityChartData', () => {
  it('preserves zero-liquidity entries that close a range', () => {
    expect(
      getDensityChartData([
        {
          tick: 100,
          liquidityActive: 10n,
          liquidityNet: 10n,
          price0: '1',
        },
        {
          tick: 200,
          liquidityActive: 0n,
          liquidityNet: -10n,
          price0: '2',
        },
      ]),
    ).toEqual([
      { activeLiquidity: 10, price0: 1 },
      { activeLiquidity: 0, price0: 2 },
    ])
  })

  it('drops invalid negative active liquidity', () => {
    expect(
      getDensityChartData([
        {
          tick: 100,
          liquidityActive: -1n,
          liquidityNet: 0n,
          price0: '1',
        },
      ]),
    ).toEqual([])
  })
})
