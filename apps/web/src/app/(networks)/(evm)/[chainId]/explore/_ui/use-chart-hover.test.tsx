/** @vitest-environment jsdom */

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTVLChart } from './tvl-chart'
import { useVolumeChart } from './volume-chart'

interface ChartRenderProps {
  option: {
    tooltip: { formatter: (params: { data?: number[] }[]) => string }
  }
  onEvents: { globalout: () => void }
}

const mocks = vi.hoisted(() => ({
  renderChart: vi.fn<(props: ChartRenderProps) => void>(),
}))

vi.mock('echarts-for-react/lib/core', () => ({
  default: (props: ChartRenderProps) => {
    mocks.renderChart(props)
    return null
  },
}))
vi.mock('@sushiswap/hooks', () => ({ useIsMounted: () => true }))
vi.mock('next-themes', () => ({ useTheme: () => ({ resolvedTheme: 'light' }) }))
vi.mock('./global-stats-chart-card', () => ({
  GlobalStatsChartCard: () => null,
}))
vi.mock('./global-stats-charts', () => ({
  timeframeToMs: {
    '1W': 7 * 86_400_000,
    '1M': 30 * 86_400_000,
    '3M': 90 * 86_400_000,
    All: Number.MAX_SAFE_INTEGER,
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const newest = new Date(2026, 10, 16, 12).getTime()
const older = new Date(2026, 10, 5, 12).getTime()
const data: AnalyticsDayBuckets = {
  v2: [
    { id: 'v2-new', date: newest / 1000, liquidityUSD: 100, volumeUSD: 10 },
    { id: 'v2-old', date: older / 1000, liquidityUSD: 80, volumeUSD: 15 },
  ],
  v3: [
    { id: 'v3-new', date: newest / 1000, liquidityUSD: 200, volumeUSD: 20 },
    { id: 'v3-old', date: older / 1000, liquidityUSD: 180, volumeUSD: 25 },
  ],
  blade: [],
}

function Probe({
  useChart,
  chainId = EvmChainId.ETHEREUM,
}: {
  useChart: typeof useTVLChart
  chainId?: EvmChainId
}): React.ReactElement {
  const chart = useChart({ data, chainId, showBlade: false })

  return (
    <>
      <div data-summary="desktop" hidden>
        {chart.summary}
      </div>
      <div data-summary="mobile">{chart.summary}</div>
      {chart.children}
      <button type="button" onClick={() => chart.onTimeframeChange?.('1W')}>
        Week
      </button>
      <button type="button" onClick={chart.onDeselect}>
        Deselect
      </button>
    </>
  )
}

function getChart(): ChartRenderProps {
  const props = mocks.renderChart.mock.lastCall?.[0]
  if (!props) throw new Error('Chart did not render')
  return props
}

describe.each([
  ['TVL', useTVLChart, '$300.00', 'Nov 16, 2026'],
  ['volume', useVolumeChart, '$30.00', 'Past week'],
] as const)('%s chart hover', (_name, useChart, weeklyValue, weeklyLabel) => {
  let container: HTMLDivElement
  let root: Root

  function summaries(): (string | null)[] {
    return Array.from(
      container.querySelectorAll('[data-summary]'),
      (node) => node.textContent,
    )
  }

  function hover(): void {
    act(() => {
      getChart().option.tooltip.formatter([
        { data: [older, 5] },
        { data: [older, 10] },
        { data: [older, 2] },
      ])
    })
  }

  beforeEach(() => {
    mocks.renderChart.mockClear()
    vi.spyOn(Date, 'now').mockReturnValue(new Date(2026, 10, 17, 12).getTime())
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => root.render(<Probe useChart={useChart} />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('updates both responsive headings and resets without replacing chart handlers', () => {
    const initial = summaries()
    const chart = getChart()

    hover()

    expect(summaries()).toEqual([
      '$17.00Ethereum · Nov 05, 2026',
      '$17.00Ethereum · Nov 05, 2026',
    ])
    expect(getChart().option).toBe(chart.option)
    expect(getChart().onEvents.globalout).toBe(chart.onEvents.globalout)

    act(() => getChart().onEvents.globalout())
    expect(summaries()).toEqual(initial)

    hover()
    act(() => container.querySelectorAll('button')[1].click())
    expect(summaries()).toEqual(initial)
  })

  it('clears the hovered point when the timeframe changes', () => {
    hover()
    act(() => container.querySelector('button')?.click())

    const expected = `${weeklyValue}Ethereum · ${weeklyLabel}`
    expect(summaries()).toEqual([expected, expected])
  })

  it('clears the hovered point when the chain changes', () => {
    const initial = summaries()
    hover()
    act(() =>
      root.render(<Probe useChart={useChart} chainId={EvmChainId.POLYGON} />),
    )

    expect(summaries()).toEqual(
      initial.map((summary) => summary?.replace('Ethereum', 'Polygon')),
    )
  })
})
