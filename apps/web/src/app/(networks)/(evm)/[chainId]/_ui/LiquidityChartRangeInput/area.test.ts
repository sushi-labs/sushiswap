import { scaleLinear } from 'd3'
import { describe, expect, it } from 'vitest'
import { prepareSeriesForRendering } from './area'

const xScale = scaleLinear().domain([0, 10]).range([0, 100])

describe('prepareSeriesForRendering', () => {
  it('extends a final positive step to the visible right boundary', () => {
    expect(
      prepareSeriesForRendering(
        [{ activeLiquidity: 10, price0: 4 }],
        xScale,
        (entry) => entry.price0,
      ),
    ).toEqual([
      { activeLiquidity: 10, price0: 4 },
      { activeLiquidity: 10, price0: 10 },
    ])
  })

  it('uses an off-screen zero-liquidity point to close the visible step', () => {
    expect(
      prepareSeriesForRendering(
        [
          { activeLiquidity: 10, price0: 4 },
          { activeLiquidity: 0, price0: 20 },
        ],
        xScale,
        (entry) => entry.price0,
      ),
    ).toEqual([
      { activeLiquidity: 10, price0: 4 },
      { activeLiquidity: 0, price0: 10 },
    ])
  })
})
