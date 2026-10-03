/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  EvmChainId,
  EvmToken,
  SushiSwapV3Pool,
  TickMath,
  USDG,
} from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  ConcentratedLiquidityProvider,
  useConcentratedDerivedMintInfo,
} from '../concentrated-liquidity-provider'
import { SelectPricesWidget } from './index'

const mocks = vi.hoisted(() => ({
  pool: vi.fn<() => SushiSwapV3Pool | null>(() => null),
}))
vi.mock('wagmi', () => ({ useConnection: () => ({ address: undefined }) }))
vi.mock(
  'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool',
  () => ({
    useConcentratedLiquidityPool: () => ({
      data: mocks.pool(),
      isInitialLoading: false,
      isLoading: false,
      isError: false,
    }),
  }),
)
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: () => [0, 0],
}))
vi.mock(
  'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats',
  () => ({
    useConcentratedLiquidityPoolStats: () => ({ data: undefined }),
  }),
)
vi.mock(
  'src/lib/wagmi/hooks/positions/hooks/use-concentrated-positions-from-token-id',
  () => ({
    useConcentratedLiquidityPositionsFromTokenId: () => ({
      data: undefined,
      isLoading: false,
    }),
  }),
)
vi.mock('../liquidity-chart-range-input', () => ({
  LiquidityChartRangeInput: () => null,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const fig = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0x41f4267525a8aff329540ef24fd83d9044758b33',
  decimals: 18,
  symbol: 'FIG',
  name: 'Figma',
})
const usdg = USDG[EvmChainId.ROBINHOOD]
let feeAmount: 100 | 500 = 500
let root: Root
let container: HTMLDivElement
let info: ReturnType<typeof useConcentratedDerivedMintInfo> | undefined

function MintInfo({ inverted }: { inverted: boolean }): null {
  info = useConcentratedDerivedMintInfo({
    chainId: EvmChainId.ROBINHOOD,
    account: undefined,
    token0: inverted ? usdg : fig,
    token1: inverted ? fig : usdg,
    baseToken: inverted ? usdg : fig,
    feeAmount: feeAmount,
  })
  return null
}

async function render(inverted = false): Promise<void> {
  await act(async () => {
    root.render(
      <ConcentratedLiquidityProvider>
        <SelectPricesWidget
          chainId={EvmChainId.ROBINHOOD}
          token0={inverted ? usdg : fig}
          token1={inverted ? fig : usdg}
          poolAddress={undefined}
          tokenId={undefined}
          feeAmount={feeAmount}
        />
        <MintInfo inverted={inverted} />
      </ConcentratedLiquidityProvider>,
    )
  })
}

function setStartingPrice(value: string): void {
  const input = container.querySelector<HTMLInputElement>(
    '[testdata-id="start-price-input"]',
  )
  if (!input) throw new Error('Missing starting price input')
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

function select(side: 'Left' | 'Right'): void {
  const button = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === `Single Sided (${side})`,
  )
  if (!button) throw new Error('Missing single-sided preset')
  act(() => button.click())
}

beforeEach(() => {
  feeAmount = 500
  mocks.pool.mockReturnValue(null)
  info = undefined
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

it.each(['', '0', '1'.padEnd(81, '0')])(
  'leaves ranges unset for an invalid starting price: %s',
  async (value) => {
    await render()
    setStartingPrice(value)
    select('Left')
    select('Right')
    expect(info?.ticks.LOWER).toBeUndefined()
    expect(info?.ticks.UPPER).toBeUndefined()
  },
)

it.each([
  { inverted: false, side: 'Left' as const },
  { inverted: false, side: 'Right' as const },
  { inverted: true, side: 'Left' as const },
  { inverted: true, side: 'Right' as const },
])(
  'creates a single-sided range before pool creation: $side, inverted=$inverted',
  async ({ inverted, side }) => {
    await render(inverted)
    setStartingPrice(inverted ? '0.05' : '20')
    select(side)
    expect(info?.noLiquidity).toBe(true)
    expect(info?.invalidRange).toBe(false)
    expect(info?.depositADisabled).toBe(side === 'Left')
    expect(info?.depositBDisabled).toBe(side === 'Right')
    expect(info?.ticks.LOWER).toBeTypeOf('number')
    expect(info?.ticks.UPPER).toBeTypeOf('number')
  },
)

it('preserves inverted single-sided selection at an exact tick with spacing 1', async () => {
  feeAmount = 100
  mocks.pool.mockReturnValue(
    new SushiSwapV3Pool(
      fig,
      usdg,
      feeAmount,
      TickMath.getSqrtRatioAtTick(-999),
      1n,
      -999,
    ),
  )
  await render(true)
  select('Left')
  expect(info?.depositADisabled).toBe(true)
  expect(info?.depositBDisabled).toBe(false)
})

it('preserves the right preset for an existing pool at the minimum tick', async () => {
  mocks.pool.mockReturnValue(
    new SushiSwapV3Pool(
      fig,
      usdg,
      feeAmount,
      TickMath.getSqrtRatioAtTick(-887272),
      1n,
      -887272,
    ),
  )
  await render()
  select('Right')
  expect(info?.ticks.LOWER).toBe(-887270)
  expect(info?.depositADisabled).toBe(false)
  expect(info?.depositBDisabled).toBe(true)
})
