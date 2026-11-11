import { scaleLinear } from 'd3'
import { processActiveLiquidity } from 'src/lib/pool/cl'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { prepareSeriesForRendering } from './area'
import { getDensityChartData } from './hooks'

describe('getDensityChartData', () => {
  it('reverses inverted prices while keeping liquidity on the correct intervals', () => {
    expect(
      getDensityChartData([
        { tick: -100, liquidityActive: 10n, liquidityNet: 10n, price0: '4' },
        { tick: 0, liquidityActive: 20n, liquidityNet: 10n, price0: '2' },
        { tick: 100, liquidityActive: 0n, liquidityNet: -20n, price0: '1' },
      ]),
    ).toEqual([
      { activeLiquidity: 20, price0: 1 },
      { activeLiquidity: 10, price0: 2 },
      { activeLiquidity: 0, price0: 4 },
    ])
  })

  it.each([false, true])(
    'renders pool liquidity with inverted prices: %s',
    (inverted) => {
      const token0 = new EvmToken({
        chainId: EvmChainId.ETHEREUM,
        address: '0x0000000000000000000000000000000000000001',
        decimals: 18,
        symbol: 'AAA',
        name: 'Token A',
      })
      const token1 = new EvmToken({
        chainId: EvmChainId.ETHEREUM,
        address: '0x0000000000000000000000000000000000000002',
        decimals: 18,
        symbol: 'BBB',
        name: 'Token B',
      })
      const processed = processActiveLiquidity({
        token0: inverted ? token1 : token0,
        token1: inverted ? token0 : token1,
        activeTick: 0,
        liquidity: 1000n,
        ticks: [
          { tickIdx: -10000, liquidityNet: 1000n },
          { tickIdx: 10000, liquidityNet: -1000n },
        ],
      })
      if (!processed) throw new Error('Expected liquidity')
      const rendered = prepareSeriesForRendering(
        getDensityChartData(processed),
        scaleLinear().domain([0.5, 2]),
        (entry) => entry.price0,
      )
      expect(rendered.map(({ price0 }) => price0)).toEqual([0.5, 1, 2])
      expect(rendered[0].activeLiquidity).toBe(1000)
      expect(rendered[1].activeLiquidity).toBe(1000)
    },
  )

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
