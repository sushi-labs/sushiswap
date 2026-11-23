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

  it('keeps liquidity on the correct price intervals when the pair is reversed', () => {
    expect(
      getDensityChartData(
        [
          { tick: 100, price0: '4', liquidityActive: 3n, liquidityNet: 3n },
          { tick: 200, price0: '2', liquidityActive: 11n, liquidityNet: 8n },
          { tick: 300, price0: '1', liquidityActive: 0n, liquidityNet: -11n },
        ],
        true,
      ),
    ).toEqual([
      { price0: 1, activeLiquidity: 11 },
      { price0: 2, activeLiquidity: 3 },
      { price0: 4, activeLiquidity: 0 },
    ])
  })
})
