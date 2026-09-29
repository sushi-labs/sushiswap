/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { Bound } from 'src/lib/constants'
import { encodeSqrtRatioX96 } from 'sushi/evm'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { expect, it, vi } from 'vitest'
import type { LiquidityChartRangeInputProps as ChartProps } from '~evm/[chainId]/_ui/liquidity-chart-range-input/types'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { LiquidityChartRangeInput } from './index'

const mocks = vi.hoisted(() => ({
  chart: vi.fn<(props: ChartProps) => void>(),
}))
vi.mock('~evm/[chainId]/_ui/liquidity-chart-range-input/chart', () => ({
  Chart: (props: ChartProps) => {
    mocks.chart(props)
    return null
  },
}))
vi.mock('../../lib/hooks/tick/use-density-chart-data', () => ({
  useDensityChartData: () => ({
    isLoading: false,
    error: null,
    data: [
      { price0: 0.05, activeLiquidity: 10 },
      { price0: 0.1, activeLiquidity: 20 },
      { price0: 0.2, activeLiquidity: 30 },
    ],
  }),
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const token0 = STELLAR_XLM[StellarChainId.STELLAR]
const token1 = new StellarToken({
  ...STELLAR_USDC[StellarChainId.STELLAR].toJSON(),
  decimals: 6,
})
const pool: PoolInfo = {
  name: 'XLM/USDC',
  address: token1.address,
  token0,
  token1,
  fee: 3000,
  tickSpacing: 60,
  liquidity: { amount: '20' },
  reserves: {
    token0: { code: 'XLM', amount: '20' },
    token1: { code: 'USDC', amount: '20' },
  },
  sqrtPriceX96: encodeSqrtRatioX96(1n, 5n),
  tick: -16096,
}

it.each([false, true])(
  'keeps human prices and brush callbacks canonical with unequal decimals, inverted=%s',
  (inverted) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const lower = vi.fn()
    const upper = vi.fn()
    try {
      act(() =>
        root.render(
          <LiquidityChartRangeInput
            pool={pool}
            inverted={inverted}
            interactive
            priceRange={{ [Bound.LOWER]: 0.5, [Bound.UPPER]: 4 }}
            ticksAtLimit={{ [Bound.LOWER]: true }}
            onLeftRangeInput={lower}
            onRightRangeInput={upper}
          />,
        ),
      )
      const chart = mocks.chart.mock.lastCall?.[0]
      expect(chart).toBeDefined()
      if (!chart) throw new Error('Chart was not rendered')
      expect(chart.data.current).toBeCloseTo(inverted ? 0.5 : 2)
      expect(chart.data.series.map((point) => point.price0)).toEqual([
        0.5, 1, 2,
      ])
      expect(chart.data.series.map((point) => point.activeLiquidity)).toEqual(
        inverted ? [30, 20, 10] : [10, 20, 30],
      )
      expect(chart.brushDomain).toEqual(inverted ? [0.25, 2] : [0.5, 4])
      expect(chart.brushLabels(inverted ? 'e' : 'w', 1)).toBe(
        inverted ? '∞' : '0',
      )
      act(() => chart.onBrushDomainChange([0.25, 2], undefined))
      expect(lower).toHaveBeenLastCalledWith(inverted ? '0.5' : '0.25')
      expect(upper).toHaveBeenLastCalledWith(inverted ? '4' : '2')
    } finally {
      act(() => root.unmount())
    }
  },
)
