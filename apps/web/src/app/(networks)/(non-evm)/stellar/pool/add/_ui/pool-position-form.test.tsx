/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { getGasBalanceReserve } from 'src/lib/wagmi/components/web3-input/currency/native-balance-reserve'
import { Amount } from 'sushi'
import { TickMath } from 'sushi/evm'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  type StellarContractAddress,
} from 'sushi/stellar'
import { parseUnits } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  TICK_SPACINGS,
  getSqrtRatioAtTick,
} from '~stellar/_common/lib/utils/ticks'
import { PoolPositionForm } from './pool-position-form'

const mocks = vi.hoisted(() => ({
  pool: {
    data: null as StellarContractAddress | null,
    isPending: false,
    isError: false,
    isSuccess: true,
    refetch: vi.fn(),
  },
  initialized: false,
  sqrtPriceX96: 1n << 96n,
  create: vi.fn(),
  add: vi.fn(),
  busy: vi.fn(),
}))
const token0 = STELLAR_XLM[StellarChainId.STELLAR]
const token1 = STELLAR_USDC[StellarChainId.STELLAR]
const poolAddress = token1.address
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

vi.mock('~stellar/_common/lib/hooks/factory/use-get-pool', () => ({
  useGetPool: () => mocks.pool,
}))
vi.mock('~stellar/_common/lib/hooks/pool/use-pool-initialized', () => ({
  usePoolInitialized: () => ({
    data: mocks.initialized,
    isError: false,
    isPending: false,
    refetch: vi.fn(),
  }),
}))
vi.mock('~stellar/_common/lib/hooks/pool/use-pool-info', () => ({
  usePoolInfo: () => ({
    data: { sqrtPriceX96: mocks.sqrtPriceX96 },
    isError: false,
    isPending: false,
    refetch: vi.fn(),
  }),
}))
vi.mock(
  '~stellar/_common/lib/hooks/factory/use-create-and-initialize-pool',
  () => ({ useCreateAndInitializePool: () => ({ mutateAsync: mocks.create }) }),
)
vi.mock('~stellar/_common/lib/hooks/liquidity/use-add-liquidity', () => ({
  useAddLiquidity: () => ({ mutateAsync: mocks.add }),
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
}))
vi.mock('~stellar/providers', () => ({
  useStellarWallet: () => ({
    signTransaction: vi.fn(),
    signAuthEntry: vi.fn(),
  }),
}))
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/amounts', () => ({
  Amounts: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('~stellar/_common/ui/checker/trustline', () => ({
  Trustlines: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('~stellar/_common/ui/liquidity-chart-range-input', () => ({
  LiquidityChartRangeInput: () => <div aria-label="Liquidity distribution" />,
}))
vi.mock('~evm/_common/ui/balance-provider/use-balance', () => ({
  useAmountBalance: (token: typeof token0) => ({
    data: new Amount(token, 1000n * 10n ** BigInt(token.decimals)),
  }),
}))
vi.mock('src/lib/wagmi/components/web3-input/currency', () => ({
  CurrencyInput: ({
    id,
    value,
    disabled,
    onChange,
    onMax,
    disableMaxButton,
    currency,
  }: {
    id: string
    value: string
    disabled: boolean
    onChange(value: string): void
    onMax(): void
    disableMaxButton: boolean
    currency: typeof token0
  }) => (
    <>
      <input
        aria-label={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        disabled={disableMaxButton}
        onClick={onMax}
        aria-label={`Use maximum ${currency.symbol}`}
      >
        Balance
      </button>
    </>
  ),
}))

let root: Root
let container: HTMLDivElement
function render(fee = 3000): void {
  act(() =>
    root.render(
      <PoolPositionForm
        token0={token0}
        token1={token1}
        fee={fee}
        onBusyChange={mocks.busy}
      />,
    ),
  )
}
function input(label: string): HTMLInputElement {
  const element = container.querySelector<HTMLInputElement>(
    `input[aria-label="${label}"]`,
  )
  if (!element) throw new Error(`Missing input ${label}`)
  return element
}
function button(label: string): HTMLButtonElement {
  const element = Array.from(container.querySelectorAll('button')).find(
    (element) =>
      element.textContent === label ||
      element.getAttribute('aria-label') === label,
  )
  if (!element)
    throw new Error(`Missing button ${label}: ${container.textContent}`)
  return element
}
function fill(label: string, value: string): void {
  act(() => {
    const element = input(label)
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set?.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
function commit(label: string, value: string): void {
  fill(label, value)
  act(() =>
    input(label).dispatchEvent(new FocusEvent('focusout', { bubbles: true })),
  )
}
async function click(label: string): Promise<void> {
  await act(async () => button(label).click())
}
function prepare(): void {
  render()
  fill('Starting price', '1')
  fill('stellar-add-liquidity-token0', '10')
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.pool = {
    data: null,
    isPending: false,
    isError: false,
    isSuccess: true,
    refetch: vi.fn(),
  }
  mocks.initialized = false
  mocks.sqrtPriceX96 = 1n << 96n
  mocks.create.mockResolvedValue({ result: { poolAddress } })
  mocks.add.mockResolvedValue({ result: { txHash: 'confirmed-liquidity' } })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('Stellar pool creation flow', () => {
  it('blocks an invalid on-chain square-root price without crashing the range selector', () => {
    mocks.pool.data = poolAddress
    mocks.initialized = true
    mocks.sqrtPriceX96 = 0n
    render()
    fill('stellar-add-liquidity-token0', '10')
    expect(button('Invalid liquidity price, range, or amount').disabled).toBe(
      true,
    )
    expect(mocks.add).not.toHaveBeenCalled()
  })
  it.each([500, 3000, 10000])(
    'keeps the narrow preset on both sides of the current price at fee %s',
    async (fee) => {
      mocks.pool.data = poolAddress
      mocks.initialized = true
      mocks.sqrtPriceX96 = getSqrtRatioAtTick(1)
      render(fee)
      await click('×÷1.01')
      expect(input('stellar-add-liquidity-token0').disabled).toBe(false)
      expect(input('stellar-add-liquidity-token1').disabled).toBe(false)
      fill('stellar-add-liquidity-token0', '10')
      await click('Add liquidity')
      expect(mocks.add.mock.calls[0][0].tickLower).toBeLessThan(1)
      expect(mocks.add.mock.calls[0][0].tickUpper).toBeGreaterThan(1)
    },
  )
  it('centers the range on the exact negative tick without a float-induced spacing shift', async () => {
    mocks.pool.data = poolAddress
    mocks.initialized = true
    mocks.sqrtPriceX96 = getSqrtRatioAtTick(-30)
    render()
    fill('stellar-add-liquidity-token0', '10')
    await click('Add liquidity')
    expect(mocks.add.mock.calls[0][0]).toMatchObject({
      tickLower: -60000,
      tickUpper: 60000,
    })
  })
  it('does not offer initialization while pool discovery is loading or failed', () => {
    mocks.pool.isPending = true
    mocks.pool.isSuccess = false
    render()
    expect(container.textContent).toContain('Checking pool')
    expect(container.querySelector('#stellar-start-price')).toBeNull()
    mocks.pool.isPending = false
    mocks.pool.isError = true
    render()
    expect(container.textContent).toContain('Unable to load this pool')
    expect(mocks.create).not.toHaveBeenCalled()
  })
  it('requires an explicit initial price and calculates from either token', () => {
    render()
    expect(input('stellar-add-liquidity-token0').disabled).toBe(true)
    fill('Starting price', '1')
    fill('stellar-add-liquidity-token1', '12')
    expect(Number(input('stellar-add-liquidity-token0').value)).toBeGreaterThan(
      0,
    )
    expect(button('Create pool & add liquidity').disabled).toBe(false)
  })
  it('preserves full range and canonical initial price when quote direction changes', async () => {
    prepare()
    await click('Full Range')
    fill('Starting price', '4')
    expect(input('Min Price').value).toBe('0')
    expect(input('Max Price').value).toBe('∞')
    await click(`${token0.symbol} per ${token1.symbol}`)
    expect(input('Starting price').value).toBe('0.25')
    expect(input('Min Price').value).toBe('0')
    expect(input('Max Price').value).toBe('∞')
    await click('Create pool & add liquidity')
    expect(mocks.create.mock.calls[0][0].sqrtPriceX96).toBe(2n << 96n)
  })
  it('supports both single-sided ranges', async () => {
    prepare()
    commit('Min Price', '2')
    commit('Max Price', '4')
    expect(input('stellar-add-liquidity-token1').disabled).toBe(true)
    expect(input('stellar-add-liquidity-token1').value).toBe('0')
    await click('Create pool & add liquidity')
    expect(mocks.add.mock.calls[0][0]).toMatchObject({
      token0Amount: '10',
      token1Amount: '0',
    })
  })
  it('permits token1-only deposits above the range', async () => {
    prepare()
    commit('Min Price', '.1')
    commit('Max Price', '.5')
    expect(input('stellar-add-liquidity-token0').disabled).toBe(true)
    fill('stellar-add-liquidity-token1', '5')
    await click('Create pool & add liquidity')
    expect(mocks.add.mock.calls[0][0]).toMatchObject({
      token0Amount: '0',
      token1Amount: '5',
    })
  })
  it.each(
    ([500, 3000, 10000] as const).flatMap((fee) =>
      [false, true].flatMap((inverted) =>
        [-1n, 0n, 1n].map((offset) => ({ fee, inverted, offset })),
      ),
    ),
  )(
    'keeps single-sided presets single-sided at negative boundaries: $fee, inverted=$inverted, offset=$offset',
    async ({ fee, inverted, offset }) => {
      mocks.pool.data = poolAddress
      mocks.initialized = true
      const price = getSqrtRatioAtTick(-TICK_SPACINGS[fee]) + offset
      mocks.sqrtPriceX96 = price
      render(fee)
      if (inverted) await click(`${token0.symbol} per ${token1.symbol}`)
      for (const side of ['Left', 'Right'] as const) {
        await click(`Single Sided (${side})`)
        const token0Only = (side === 'Right') !== inverted
        expect(input('stellar-add-liquidity-token0').disabled).toBe(!token0Only)
        expect(input('stellar-add-liquidity-token1').disabled).toBe(token0Only)
        fill(`stellar-add-liquidity-token${token0Only ? '0' : '1'}`, '10')
        await click('Add liquidity')
        const params = mocks.add.mock.lastCall?.[0]
        expect(params).toBeDefined()
        expect(params[token0Only ? 'token1Amount' : 'token0Amount']).toBe('0')
        expect(Math.abs(params.tickLower % TICK_SPACINGS[fee])).toBe(0)
        expect(Math.abs(params.tickUpper % TICK_SPACINGS[fee])).toBe(0)
        if (token0Only)
          expect(getSqrtRatioAtTick(params.tickLower)).toBeGreaterThanOrEqual(
            price,
          )
        else
          expect(getSqrtRatioAtTick(params.tickUpper)).toBeLessThanOrEqual(
            price,
          )
      }
    },
  )
  it('disables single-sided presets that cannot fit at the protocol limits', async () => {
    mocks.pool.data = poolAddress
    mocks.initialized = true
    mocks.sqrtPriceX96 = TickMath.MIN_SQRT_RATIO
    render()
    expect(button('Single Sided (Left)').disabled).toBe(true)
    expect(button('Single Sided (Right)').disabled).toBe(false)
    mocks.sqrtPriceX96 = TickMath.MAX_SQRT_RATIO - 1n
    render()
    expect(button('Single Sided (Left)').disabled).toBe(false)
    expect(button('Single Sided (Right)').disabled).toBe(true)
  })
  it('keeps a single-sided range fixed when the pool price moves', async () => {
    mocks.pool.data = poolAddress
    mocks.initialized = true
    mocks.sqrtPriceX96 = getSqrtRatioAtTick(-1)
    render()
    await click('Single Sided (Right)')
    const lower = input('Min Price').value
    const upper = input('Max Price').value
    mocks.sqrtPriceX96 = getSqrtRatioAtTick(120)
    render()
    expect(input('Min Price').value).toBe(lower)
    expect(input('Max Price').value).toBe(upper)
  })
  it('does not create an existing initialized pool', async () => {
    mocks.pool.data = poolAddress
    mocks.initialized = true
    render()
    fill('stellar-add-liquidity-token0', '10')
    await click('Add liquidity')
    expect(mocks.create).not.toHaveBeenCalled()
    expect(mocks.add).toHaveBeenCalledOnce()
    expect(document.body.textContent).toContain('Liquidity added')
    expect(input('stellar-add-liquidity-token0').value).toBe('')
  })
  it('retries only liquidity after creation succeeds and factory refresh fails', async () => {
    mocks.create.mockImplementation(async () => {
      mocks.initialized = true
      mocks.pool.isError = true
      return { result: { poolAddress } }
    })
    mocks.add
      .mockRejectedValueOnce(new Error('Wallet rejected liquidity'))
      .mockResolvedValueOnce({ result: { txHash: 'retried' } })
    prepare()
    await click('Create pool & add liquidity')
    expect(container.textContent).toContain('Wallet rejected liquidity')
    await click('Add liquidity')
    expect(mocks.create).toHaveBeenCalledOnce()
    expect(mocks.add).toHaveBeenCalledTimes(2)
  })
  it('prevents a double submission and stops after an unmount during creation', async () => {
    let finish:
      | ((value: { result: { poolAddress: StellarContractAddress } }) => void)
      | undefined
    mocks.create.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    prepare()
    const submit = button('Create pool & add liquidity')
    await act(async () => {
      submit.click()
      submit.click()
    })
    expect(mocks.create).toHaveBeenCalledOnce()
    act(() => root.unmount())
    root = createRoot(container)
    await act(async () => finish?.({ result: { poolAddress } }))
    expect(mocks.add).not.toHaveBeenCalled()
  })
  it('keeps XLM reserved when using maximum liquidity', async () => {
    prepare()
    await click(`Use maximum ${token0.symbol}`)
    const reserve = getGasBalanceReserve(token0)
    expect(reserve).toBeGreaterThan(0n)
    expect(
      parseUnits(input('stellar-add-liquidity-token0').value, token0.decimals),
    ).toBeLessThanOrEqual(parseUnits('1000', token0.decimals) - reserve)
  })
})
