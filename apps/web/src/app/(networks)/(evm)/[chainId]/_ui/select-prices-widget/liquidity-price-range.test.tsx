/** @vitest-environment jsdom */

import { type ReactElement, act, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Bound, Field } from 'src/lib/constants'
import { EvmChainId, EvmToken, SushiSwapV3Pool, TickMath } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  ConcentratedLiquidityProvider,
  useConcentratedDerivedMintInfo,
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '../concentrated-liquidity-provider'
import {
  type LiquidityFormMode,
  LiquidityFormModeToggle,
} from './liquidity-form-mode-toggle'
import { LiquidityPriceRange } from './liquidity-price-range'

const mocks = vi.hoisted(() => ({
  pool: null as SushiSwapV3Pool | null,
  prices: { NEW: undefined, ETH: 2400 } as Record<string, number | undefined>,
  priceError: false,
  priceLoading: false,
  currencyPrice: vi.fn(),
}))
vi.mock('wagmi', () => ({ useConnection: () => ({ address: undefined }) }))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => undefined,
}))
vi.mock(
  'src/lib/wagmi/hooks/pools/hooks/use-concentrated-liquidity-pool',
  () => ({
    useConcentratedLiquidityPool: () => ({
      data: mocks.pool,
      isInitialLoading: false,
      isLoading: false,
      isError: false,
    }),
  }),
)
vi.mock(
  '~evm/_common/ui/price-provider/price-provider/use-currency-price',
  () => ({
    useCurrencyPrice: ({ currency }: { currency?: EvmToken }) => {
      mocks.currencyPrice()
      return {
        data: mocks.prices[currency?.symbol ?? ''],
        isError: mocks.priceError,
        isLoading: mocks.priceLoading,
      }
    },
  }),
)
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: () => [0, 0],
}))
vi.mock(
  'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats',
  () => ({ useConcentratedLiquidityPoolStats: () => ({ data: undefined }) }),
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
  LiquidityChartRangeInput: () => <div>Liquidity chart</div>,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const token = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'NEW',
  name: 'New token',
})
const quote = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 18,
  symbol: 'ETH',
  name: 'Ether',
})
const usdc = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000003',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
})
let root: Root
let container: HTMLDivElement
let info: ReturnType<typeof useConcentratedDerivedMintInfo>
let state: ReturnType<typeof useConcentratedMintState>
let actions: ReturnType<typeof useConcentratedMintActionHandlers>
let reverse = false
let quoteToken = quote
let feeAmount: 100 | 500 | 3000 = 3000

function StateProbe(): null {
  state = useConcentratedMintState()
  actions = useConcentratedMintActionHandlers()
  info = useConcentratedDerivedMintInfo({
    chainId: EvmChainId.ETHEREUM,
    account: undefined,
    token0: reverse ? quoteToken : token,
    token1: reverse ? token : quoteToken,
    baseToken: reverse ? quoteToken : token,
    feeAmount,
  })
  return null
}

function TestForm({ tokenId }: { tokenId?: string }): ReactElement {
  const [mode, setMode] = useState<LiquidityFormMode>('simple')
  return (
    <>
      {tokenId === undefined && (
        <LiquidityFormModeToggle mode={mode} onModeChange={setMode} />
      )}
      <LiquidityPriceRange
        mode={mode}
        chainId={EvmChainId.ETHEREUM}
        token0={reverse ? quoteToken : token}
        token1={reverse ? token : quoteToken}
        feeAmount={feeAmount}
        tokenId={tokenId}
        poolAddress={undefined}
      />
    </>
  )
}

async function render(tokenId?: string): Promise<void> {
  await act(async () => {
    root.render(
      <ConcentratedLiquidityProvider>
        <TestForm tokenId={tokenId} />
        <StateProbe />
      </ConcentratedLiquidityProvider>,
    )
  })
}

function button(text: string): HTMLButtonElement {
  const result = Array.from(container.querySelectorAll('button')).find(
    (node) => node.textContent === text,
  )
  if (!result) throw new Error(`Missing button: ${text}`)
  return result
}
function click(text: string): void {
  act(() => button(text).click())
}
function modeOption(mode: LiquidityFormMode): HTMLButtonElement {
  return button(mode === 'simple' ? 'Simple' : 'Advanced')
}
function setMode(mode: LiquidityFormMode): void {
  act(() => modeOption(mode).click())
}
function input(id: string): HTMLInputElement {
  const result = container.querySelector<HTMLInputElement>(
    `[testdata-id="${id}-input"]`,
  )
  if (!result) throw new Error(`Missing input: ${id}`)
  return result
}
function type(id: string, value: string, blur = true): void {
  const target = input(id)
  act(() => target.focus())
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set?.call(target, value)
    target.dispatchEvent(new Event('input', { bubbles: true }))
  })
  if (blur) act(() => target.blur())
}
function seed(): void {
  act(() => {
    actions.onStartPriceInput('0.0002')
    actions.onLeftRangeInput('0.000075')
    actions.onRightRangeInput('0.0005')
    actions.onFieldAInput('100', true)
  })
}

beforeEach(() => {
  mocks.pool = null
  mocks.prices = { NEW: undefined, ETH: 2400, USDC: 1 }
  mocks.priceError = false
  mocks.priceLoading = false
  mocks.currencyPrice.mockClear()
  reverse = false
  quoteToken = quote
  feeAmount = 3000
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

it('defaults to Simple and keeps the original Advanced form available', async () => {
  await render()
  expect(modeOption('advanced').getAttribute('aria-checked')).toBe('false')
  expect(input('simple-min-price')).toBeDefined()
  expect(container.textContent).not.toContain('Token Ratio')
  mocks.currencyPrice.mockClear()
  setMode('advanced')
  expect(modeOption('advanced').getAttribute('aria-checked')).toBe('true')
  expect(container.textContent).toContain('Token Ratio')
  expect(container.textContent).toContain('Full Range')
  expect(mocks.currencyPrice).not.toHaveBeenCalled()
  expect(input('min-price')).toBeDefined()
})

it('preserves exact mint state, ticks, deposit amounts and liquidity across mode/unit/token-view changes', async () => {
  await render()
  seed()
  const before = state
  const ticks = info.ticks
  const liquidity = info.position?.liquidity
  expect(liquidity).toBeGreaterThan(0n)
  setMode('simple')
  expect(container.textContent).not.toContain('Token Ratio')
  expect(container.textContent).not.toContain('Full Range')
  click('Token units')
  click('USD')
  click('ETH')
  click('NEW')
  setMode('advanced')
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(ticks)
  expect(info.position?.liquidity).toBe(liquidity)
})

it.each([false, true])(
  'creates a position using USD inputs in either canonical token order (reverse=%s)',
  async (reversed) => {
    reverse = reversed
    await render()
    setMode('simple')
    if (reverse) click('NEW')
    expect(button('USD').disabled).toBe(false)
    expect(input('simple-start-price').value).toBe('')
    type('simple-start-price', '0.48')
    type('simple-min-price', '0.18')
    type('simple-max-price', '1.2')
    expect(Number(state.startPriceTypedValue)).toBeCloseTo(
      reverse ? 5000 : 0.0002,
      10,
    )
    expect(Number(state.leftRangeTypedValue)).toBeCloseTo(
      reverse ? 2000 : 0.000075,
      10,
    )
    expect(Number(state.rightRangeTypedValue)).toBeCloseTo(
      reverse ? 13333.333333333334 : 0.0005,
      8,
    )
    expect(info.invalidRange).toBe(false)
    act(() => actions.onFieldAInput('100', true))
    expect(info.position?.liquidity).toBeGreaterThan(0n)
    const ticks = info.ticks
    setMode('advanced')
    expect(info.ticks).toEqual(ticks)
    expect(input('start-price').value).toBe(state.startPriceTypedValue)
  },
)

it('supports a six-decimal paired token without assuming a one-dollar peg', async () => {
  quoteToken = usdc
  mocks.prices.USDC = 0.98
  await render()
  setMode('simple')
  type('simple-start-price', '0.49')
  type('simple-min-price', '0.245')
  type('simple-max-price', '0.98')
  expect(state.startPriceTypedValue).toBe('0.5')
  expect(state.leftRangeTypedValue).toBe('0.25')
  expect(state.rightRangeTypedValue).toBe('1')
  expect(info.invalidRange).toBe(false)
  act(() => actions.onFieldAInput('100', true))
  expect(info.position?.liquidity).toBeGreaterThan(0n)
})

it.each([undefined, 0, Number.NaN, Number.POSITIVE_INFINITY, -10])(
  'falls back to token units for an unusable quote: %s',
  async (price) => {
    mocks.prices.ETH = price
    await render()
    setMode('simple')
    expect(button('USD').disabled).toBe(true)
    expect(button('USD').getAttribute('aria-checked')).toBe('false')
    expect(button('Token units').getAttribute('aria-checked')).toBe('true')
    expect(button('USD').getAttribute('aria-describedby')).toBe(
      'simple-usd-unavailable',
    )
    expect(container.textContent).toContain('USD value unavailable')
    expect(container.textContent).toContain('ETH per NEW')
    type('simple-start-price', '0.0002')
    type('simple-min-price', '0.000075')
    type('simple-max-price', '0.0005')
    expect(state.startPriceTypedValue).toBe('0.0002')
    expect(info.invalidRange).toBe(false)
  },
)

it('does not apply a suggested starting price without an explicit click', async () => {
  mocks.prices.NEW = 0.48
  await render()
  setMode('simple')
  expect(state.startPriceTypedValue).toBe('')
  click('Use market price')
  expect(state.startPriceTypedValue).toBe('0.0002')
  type('simple-start-price', '0.6')
  mocks.prices.NEW = 0.72
  await render()
  expect(state.startPriceTypedValue).toBe('0.00025')
})

it('keeps ticks fixed as quotes update and when a price becomes unavailable', async () => {
  await render()
  seed()
  setMode('simple')
  const before = state
  const beforeTicks = info.ticks
  const min = Number(input('simple-min-price').value)
  mocks.prices.ETH = 3000
  await render()
  expect(Number(input('simple-min-price').value)).toBeCloseTo(min * 1.25, 6)
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(beforeTicks)
  mocks.priceError = true
  await render()
  expect(button('USD').disabled).toBe(true)
  expect(button('Token units').getAttribute('aria-checked')).toBe('true')
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(beforeTicks)
  mocks.priceError = false
  await render()
  expect(button('USD').disabled).toBe(false)
  expect(button('USD').getAttribute('aria-checked')).toBe('true')
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(beforeTicks)
})

it('retains an explicit token-units choice when an unavailable USD quote returns', async () => {
  mocks.priceError = true
  await render()
  seed()
  const before = state
  const ticks = info.ticks
  click('Token units')
  mocks.priceError = false
  await render()
  expect(button('USD').disabled).toBe(false)
  expect(button('USD').getAttribute('aria-checked')).toBe('false')
  expect(button('Token units').getAttribute('aria-checked')).toBe('true')
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(ticks)
})

it('uses the quote at focus time when a quote update arrives during an edit', async () => {
  await render()
  seed()
  setMode('simple')
  type('simple-min-price', '0.24', false)
  mocks.prices.ETH = 3000
  await render()
  act(() => input('simple-min-price').blur())
  expect(state.leftRangeTypedValue).toBe('0.0001')
})

it.each([false, true])(
  'steps one supported tick in the displayed direction (inverted view=%s)',
  async (inverted) => {
    mocks.prices.NEW = 0.48
    await render()
    seed()
    setMode('simple')
    if (inverted) click('ETH')
    for (const label of ['min', 'max']) {
      const bound = (label === 'min') !== inverted ? Bound.LOWER : Bound.UPPER
      const before = info.ticks[bound]!
      const target = container.querySelector<HTMLButtonElement>(
        `[aria-label="Increase ${label} price"]`,
      )!
      act(() => target.click())
      expect(info.ticks[bound]).toBe(before + (inverted ? -60 : 60))
      const decrease = container.querySelector<HTMLButtonElement>(
        `[aria-label="Decrease ${label} price"]`,
      )!
      act(() => decrease.click())
      expect(info.ticks[bound]).toBe(before)
    }
  },
)

it('omits starting price for an existing pool and labels inferred dollar prices', async () => {
  mocks.pool = new SushiSwapV3Pool(
    token,
    quote,
    feeAmount,
    TickMath.getSqrtRatioAtTick(-85176),
    1000000n,
    -85176,
  )
  await render()
  setMode('simple')
  expect(container.querySelector('#simple-start-price')).toBeNull()
  expect(container.textContent).toContain('Current price')
  expect(container.textContent).toContain('Pool-derived USD estimate')
  type('simple-min-price', '0.18')
  type('simple-max-price', '1.2')
  act(() => actions.onFieldAInput('100', false))
  expect(info.position?.liquidity).toBeGreaterThan(0n)
})

it('preserves full-range sentinels and a locked token ratio without changing the provider', async () => {
  await render()
  seed()
  act(() => actions.setFullRange())
  const before = state
  setMode('simple')
  expect(input('simple-min-price').value).toBe('0')
  expect(input('simple-max-price').value).toBe('∞')
  click('ETH')
  expect(input('simple-min-price').value).toBe('0')
  expect(input('simple-max-price').value).toBe('∞')
  expect(state).toEqual(before)
  setMode('advanced')
  seed()
  act(() => actions.setWeightLockedCurrencyBase(0.5))
  const lockedState = state
  setMode('simple')
  expect(input('simple-min-price').disabled).toBe(true)
  expect(container.textContent).toContain('token ratio is locked')
  expect(state).toEqual(lockedState)
})

it('clears an invalid edited bound so the previous valid position cannot be submitted', async () => {
  await render()
  seed()
  setMode('simple')
  type('simple-min-price', 'not a price')
  expect(state.leftRangeTypedValue).toBe('')
  expect(info.position).toBeUndefined()
  expect(container.textContent).toContain('Enter a valid price')
})

it('retains existing validation and single-sided deposit calculations', async () => {
  await render()
  seed()
  setMode('simple')
  type('simple-min-price', '2')
  expect(info.invalidRange).toBe(true)
  expect(info.position).toBeUndefined()
  type('simple-min-price', '0.6')
  type('simple-max-price', '1.2')
  expect(info.outOfRange).toBe(true)
  expect(info.depositBDisabled).toBe(true)
  expect(info.depositADisabled).toBe(false)
  expect(state.independentField).toBe(Field.CURRENCY_A)
})

it('keeps the original range form for existing NFT positions', async () => {
  await render('123')
  expect(container.querySelector('[aria-label="Form mode"]')).toBeNull()
  expect(input('min-price')).toBeDefined()
  expect(mocks.currencyPrice).not.toHaveBeenCalled()
})

it('can step very small token prices without passing exponent syntax into the provider', async () => {
  await render()
  setMode('simple')
  type('simple-start-price', '0.0000048')
  type('simple-min-price', '0.0000024')
  type('simple-max-price', '0.0000096')
  const before = info.ticks.LOWER!
  act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="Increase min price"]')
      ?.click(),
  )
  expect(info.ticks.LOWER).toBe(before + 60)
  expect(state.leftRangeTypedValue).not.toContain('e')
})

it.each([
  { reversed: false, selected: 'NEW', usdAvailable: true },
  { reversed: false, selected: 'ETH', usdAvailable: true },
  { reversed: true, selected: 'NEW', usdAvailable: true },
  { reversed: true, selected: 'ETH', usdAvailable: true },
  { reversed: false, selected: 'NEW', usdAvailable: false },
  { reversed: true, selected: 'ETH', usdAvailable: false },
])(
  'creates a single-token position from a new pool preset: $selected, reverse=$reversed, USD=$usdAvailable',
  async ({ reversed, selected, usdAvailable }) => {
    reverse = reversed
    if (!usdAvailable) mocks.prices.ETH = undefined
    await render()
    act(() => actions.onStartPriceInput(reverse ? '5000' : '0.0002'))
    setMode('simple')
    const firstToken = reverse ? 'ETH' : 'NEW'
    const selectedIsA = selected === firstToken
    act(() =>
      selectedIsA
        ? actions.onFieldAInput('1', true)
        : actions.onFieldBInput('1', true),
    )
    click(`${selected} only`)
    expect(info.invalidRange).toBe(false)
    expect(info.depositADisabled).toBe(!selectedIsA)
    expect(info.depositBDisabled).toBe(selectedIsA)
    expect(button(`${selected} only`).getAttribute('aria-checked')).toBe('true')
    expect(state.typedValue).toBe('1')
    expect(info.position?.liquidity).toBeGreaterThan(0n)
    const position = info.position!
    expect(
      selected === 'NEW' ? position.amount1.amount : position.amount0.amount,
    ).toBe(0n)
    const before = state
    click(firstToken === 'NEW' ? 'ETH' : 'NEW')
    click('Token units')
    setMode('advanced')
    setMode('simple')
    expect(state).toEqual(before)
    expect(info.position?.liquidity).toBe(position.liquidity)
  },
)

it('does not reuse an amount entered for the other token', async () => {
  await render()
  seed()
  setMode('simple')
  click('ETH only')
  expect(state.independentField).toBe(Field.CURRENCY_B)
  expect(state.typedValue).toBe('')
  expect(info.position).toBeUndefined()
  act(() => actions.onFieldBInput('1', true))
  expect(info.position?.liquidity).toBeGreaterThan(0n)
  expect(info.position?.amount0.amount).toBe(0n)
})

it.each([
  { selected: 'NEW', reversed: false, deselect: false },
  { selected: 'ETH', reversed: false, deselect: false },
  { selected: 'NEW', reversed: true, deselect: false },
  { selected: 'ETH', reversed: true, deselect: false },
  { selected: 'NEW', reversed: false, deselect: true },
  { selected: 'ETH', reversed: true, deselect: true },
])(
  'returns from $selected only to both tokens: reversed=$reversed, deselect=$deselect',
  async ({ selected, reversed, deselect }) => {
    reverse = reversed
    await render()
    act(() => actions.onStartPriceInput(reverse ? '5000' : '0.0002'))
    setMode('simple')
    click(`${selected} only`)
    const field = state.independentField
    act(() =>
      field === Field.CURRENCY_A
        ? actions.onFieldAInput('1', true)
        : actions.onFieldBInput('1', true),
    )
    // The explicit choice must also work after the Simple view remounts.
    setMode('advanced')
    setMode('simple')
    click(deselect ? `${selected} only` : 'Both tokens')
    expect(info.depositADisabled).toBe(false)
    expect(info.depositBDisabled).toBe(false)
    expect(info.invalidRange).toBe(false)
    expect(state.leftRangeTypedValue).toBe(true)
    expect(state.rightRangeTypedValue).toBe(true)
    expect(state.independentField).toBe(field)
    expect(state.typedValue).toBe('1')
    expect(info.position?.amount0.amount).toBeGreaterThan(0n)
    expect(info.position?.amount1.amount).toBeGreaterThan(0n)
    expect(button('Both tokens').getAttribute('aria-checked')).toBe('true')
    expect(button('NEW only').getAttribute('aria-checked')).toBe('false')
    expect(button('ETH only').getAttribute('aria-checked')).toBe('false')
    click(`${selected} only`)
    expect(button(`${selected} only`).getAttribute('aria-checked')).toBe('true')
  },
)

it('keeps a custom two-token range when reselecting Both tokens', async () => {
  await render()
  seed()
  const before = state
  const ticks = info.ticks
  const liquidity = info.position?.liquidity
  expect(button('Both tokens').getAttribute('aria-checked')).toBe('true')
  click('Both tokens')
  expect(state).toEqual(before)
  expect(info.ticks).toEqual(ticks)
  expect(info.position?.liquidity).toBe(liquidity)
})

it.each(['', '0', '1'.repeat(80)])(
  'requires a valid starting price before applying a one-token preset: %s',
  async (start) => {
    await render()
    act(() => actions.onStartPriceInput(start))
    setMode('simple')
    const before = state
    expect(button('NEW only').disabled).toBe(true)
    expect(button('ETH only').disabled).toBe(true)
    expect(button('Both tokens').disabled).toBe(true)
    expect(
      container.querySelectorAll(
        '[aria-label="Deposit tokens"] [aria-checked="true"]',
      ),
    ).toHaveLength(0)
    click('NEW only')
    expect(state).toEqual(before)
  },
)

it('honors a locked token ratio and permits custom ranges after choosing one token', async () => {
  await render()
  seed()
  act(() => actions.setWeightLockedCurrencyBase(0.5))
  setMode('simple')
  expect(button('NEW only').disabled).toBe(true)
  expect(button('Both tokens').disabled).toBe(true)
  act(() => actions.setWeightLockedCurrencyBase(undefined))
  click('NEW only')
  type('simple-min-price', '0.18')
  type('simple-max-price', '1.2')
  expect(info.depositADisabled).toBe(false)
  expect(info.depositBDisabled).toBe(false)
  expect(button('NEW only').getAttribute('aria-checked')).toBe('false')
  expect(button('ETH only').getAttribute('aria-checked')).toBe('false')
})

it.each([false, true])(
  'keeps an existing pool deposit single-token even within an aligned tick: reverse=%s',
  async (reversed) => {
    reverse = reversed
    feeAmount = 100
    mocks.pool = new SushiSwapV3Pool(
      token,
      quote,
      feeAmount,
      TickMath.getSqrtRatioAtTick(-85176) + 1000n,
      1000000n,
      -85176,
    )
    await render()
    setMode('simple')
    click('NEW only')
    expect(info.ticks.LOWER).toBe(-85175)
    expect(info.depositADisabled).toBe(reverse)
    expect(info.depositBDisabled).toBe(!reverse)
    act(() =>
      reverse
        ? actions.onFieldBInput('1', false)
        : actions.onFieldAInput('1', false),
    )
    expect(info.position?.amount1.amount).toBe(0n)
    click('ETH only')
    expect(info.ticks.UPPER).toBe(-85176)
    act(() =>
      reverse
        ? actions.onFieldAInput('1', false)
        : actions.onFieldBInput('1', false),
    )
    expect(info.position?.amount0.amount).toBe(0n)
    click('Both tokens')
    expect(info.depositADisabled).toBe(false)
    expect(info.depositBDisabled).toBe(false)
    expect(info.position?.amount0.amount).toBeGreaterThan(0n)
    expect(info.position?.amount1.amount).toBeGreaterThan(0n)
  },
)
