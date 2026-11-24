/** @vitest-environment jsdom */

import { getV3PoolPriceHistory } from '@sushiswap/graph-client/data-api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId, getSushiSwapV3SubgraphUrl } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { V3PositionPriceChart } from './v3-position-price-chart'

interface ChartRenderProps {
  option: {
    xAxis: [{ min: number; max: number }]
    series: [
      {
        data: [number, number][]
        showSymbol: boolean
        markLine: { precision: number; data: { yAxis: number }[] }
        markArea: { data: [{ yAxis: number }, { yAxis: number }][] }
      },
    ]
  }
}

const { renderChart } = vi.hoisted(() => ({
  renderChart: vi.fn<(props: ChartRenderProps) => void>(),
}))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getV3PoolPriceHistory: vi.fn(async () => []),
}))

vi.mock('echarts-for-react/lib/core', () => ({
  default: (props: ChartRenderProps) => {
    renderChart(props)
    return null
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each([
  {
    state: 'closed',
    liquidity: 0n,
    supported: true,
    loading: false,
    message: 'This position is closed.',
  },
  {
    state: 'closed on an unsupported chain',
    liquidity: 0n,
    supported: false,
    loading: false,
    message: 'This position is closed.',
  },
  {
    state: 'unsupported',
    liquidity: 1n,
    supported: false,
    loading: false,
    message: 'Price chart unavailable.',
  },
  {
    state: 'missing',
    liquidity: undefined,
    supported: true,
    loading: false,
    message: 'Price chart unavailable.',
  },
  {
    state: 'loading',
    liquidity: undefined,
    supported: true,
    loading: true,
    message: undefined,
  },
])(
  'withholds price history when the position is $state',
  ({ liquidity, supported, loading, message }) => {
    vi.spyOn(getSushiSwapV3SubgraphUrl, 'supportsChainId').mockReturnValue(
      supported,
    )
    vi.mocked(getV3PoolPriceHistory).mockClear()
    const client = new QueryClient()
    const container = document.createElement('div')
    const root = createRoot(container)
    try {
      act(() =>
        root.render(
          <QueryClientProvider client={client}>
            <V3PositionPriceChart
              address="0x0000000000000000000000000000000000000001"
              chainId={EvmChainId.ARBITRUM}
              inverted={false}
              liquidity={liquidity}
              isPositionLoading={loading}
            />
          </QueryClientProvider>,
        ),
      )
      if (message) {
        expect(container.querySelector('[role="status"]')?.textContent).toBe(
          message,
        )
      } else {
        expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
        expect(container.textContent).not.toMatch(/closed|unavailable/i)
      }
      expect(container.querySelector('button')).toBeNull()
      expect(container.querySelector('[role="img"]')).toBeNull()
      expect(getV3PoolPriceHistory).not.toHaveBeenCalled()
    } finally {
      act(() => root.unmount())
      client.clear()
      vi.restoreAllMocks()
    }
  },
)

it('switches history periods and inverts the active series, including spot and bounds', () => {
  const now = 1_795_453_200_000
  vi.spyOn(Date, 'now').mockReturnValue(now)
  const client = new QueryClient()
  const container = document.createElement('div')
  const root = createRoot(container)
  const address = '0x0000000000000000000000000000000000000001'
  const chainId = EvmChainId.ARBITRUM
  const points = [
    { timestamp: now / 1000 - 7200, price: 4 },
    { timestamp: now / 1000 - 3600, price: 2 },
  ]
  for (const period of ['1W', '1M', '1Y']) {
    client.setQueryData(
      ['v3-pool-price-history', chainId, address, period],
      points,
    )
  }
  client.setQueryData(
    ['v3-pool-price-history', chainId, address, '1D'],
    points.map(({ timestamp, price }) => ({ timestamp, price: price * 1e-9 })),
  )
  client.setQueryData(
    ['v3-pool-price-history', chainId, address, 'ALL'],
    [{ timestamp: now / 1000 - 400 * 86400, price: 5 }, ...points],
  )

  function render(
    inverted: boolean,
    currentPrice: number | undefined,
    fullRange = false,
  ): void {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <V3PositionPriceChart
            address={address}
            chainId={chainId}
            inverted={inverted}
            liquidity={1n}
            isPositionLoading={false}
            currentPrice={currentPrice}
            priceLower={fullRange ? 0 : inverted ? 1 / 3.5 : 2.5}
            priceUpper={
              fullRange ? Number.POSITIVE_INFINITY : inverted ? 1 / 2.5 : 3.5
            }
          />
        </QueryClientProvider>,
      ),
    )
  }

  function latestSeries(): ChartRenderProps['option']['series'][0] {
    const chart = renderChart.mock.lastCall?.[0]
    if (!chart) throw new Error('Expected price chart to render')
    return chart.option.series[0]
  }

  function expectDateWindow(min: number, max: number): void {
    expect(renderChart.mock.lastCall?.[0].option.xAxis[0]).toMatchObject({
      min,
      max,
    })
  }

  try {
    render(false, 3)
    expect(latestSeries().data).toEqual([
      [now - 7200000, 4],
      [now - 3600000, 2],
      [now, 3],
    ])
    expect(latestSeries().markLine.data).toMatchObject([
      { yAxis: 2.5 },
      { yAxis: 3.5 },
      {
        name: 'Current price',
        yAxis: 3,
        lineStyle: { type: 'dotted' },
        label: { show: true, formatter: '3' },
      },
    ])

    render(true, 1 / 3)
    expect(latestSeries().markLine.precision).toBe(-1)
    expect(latestSeries().data.map(([, value]) => value)).toEqual([
      1 / 4,
      1 / 2,
      1 / 3,
    ])
    expect(latestSeries().markLine.data).toMatchObject([
      { yAxis: 1 / 3.5 },
      { yAxis: 1 / 2.5 },
      {
        name: 'Current price',
        yAxis: 1 / 3,
        label: { formatter: '0.33333333' },
      },
    ])

    expect(latestSeries().markArea.data).toEqual([
      [{ yAxis: 1 / 3.5 }, { yAxis: 1 / 2.5 }],
    ])

    const controls = Array.from(container.querySelectorAll('button'))
    expect(
      controls.map(
        (button) => button.getAttribute('aria-label') ?? button.textContent,
      ),
    ).toEqual(['1D', '1W', '1M', '1Y', 'All Time'])
    for (const control of controls.slice(0, 4)) {
      act(() => control.click())
      expectDateWindow(points[0].timestamp * 1000, now)
    }
    const allTime = controls.find(
      (button) => button.getAttribute('aria-label') === 'All Time',
    )
    if (!allTime) throw new Error('Missing all-time control')
    act(() => allTime.click())
    expect(latestSeries().data[0]).toEqual([now - 400 * 86_400_000, 1 / 5])
    expectDateWindow(now - 400 * 86_400_000, now)

    render(true, 1 / 3, true)
    expect(latestSeries().markLine.data).toMatchObject([
      { name: 'Current price', yAxis: 1 / 3 },
    ])
    expect(latestSeries().markArea.data).toEqual([
      [{ yAxis: 0 }, { yAxis: Number.POSITIVE_INFINITY }],
    ])

    for (const unavailablePrice of [undefined, 0, Number.NaN]) {
      render(false, unavailablePrice, true)
      expect(latestSeries().markLine.data).toEqual([])
      expectDateWindow(now - 400 * 86_400_000, points[1].timestamp * 1000)
    }

    client.setQueryData(
      ['v3-pool-price-history', chainId, address, '1Y'],
      [{ timestamp: now / 1000 - 400 * 86400, price: 5 }, ...points],
    )
    act(() => controls[3].click())
    expectDateWindow(now - 365 * 86_400_000, points[1].timestamp * 1000)

    client.setQueryData(
      ['v3-pool-price-history', chainId, address, 'ALL'],
      [points[0]],
    )
    act(() => allTime.click())
    expect(latestSeries().data).toEqual([[points[0].timestamp * 1000, 4]])
    expect(latestSeries().showSymbol).toBe(true)

    render(false, 3e-9, true)
    act(() => controls[0].click())
    expect(latestSeries().markLine.data).toMatchObject([
      {
        name: 'Current price',
        yAxis: expect.closeTo(0.75),
        label: { formatter: '3e-9' },
      },
    ])
  } finally {
    act(() => root.unmount())
    client.clear()
    vi.restoreAllMocks()
  }
})
