/** @vitest-environment jsdom */

import { type ButtonHTMLAttributes, type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PositionSummary } from '~stellar/_common/lib/hooks/position/use-my-position'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { ManageLiquidityCard } from './manage-liquidity-card'

const mocks = vi.hoisted(() => ({
  country: 'US',
  positions: [] as PositionSummary[],
  trustlines: vi.fn(),
  zap: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  setTickLower: vi.fn(),
  setTickUpper: vi.fn(),
}))

vi.mock('@sushiswap/ui', async () => {
  const { createContext, useContext } = await import('react')
  const TabsContext = createContext({
    value: 'add',
    onValueChange: (_value: string) => {},
  })
  function Container({ children }: { children: ReactNode }): ReactNode {
    return <div>{children}</div>
  }
  return {
    Button: ({
      children,
      disabled,
      onClick,
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button type="button" disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    Card: Container,
    CardContent: Container,
    CardDescription: Container,
    CardHeader: Container,
    CardTitle: Container,
    Separator: () => null,
    TabsList: Container,
    Tabs: ({
      value,
      onValueChange,
      children,
    }: {
      value: string
      onValueChange(value: string): void
      children: ReactNode
    }) => (
      <TabsContext.Provider value={{ value, onValueChange }}>
        {children}
      </TabsContext.Provider>
    ),
    TabsTrigger: ({
      value,
      children,
    }: { value: string; children: ReactNode }) => {
      const { onValueChange } = useContext(TabsContext)
      return (
        <button type="button" onClick={() => onValueChange(value)}>
          {children}
        </button>
      )
    },
    TabsContent: ({
      value,
      children,
    }: { value: string; children: ReactNode }) =>
      useContext(TabsContext).value === value ? children : null,
  }
})
vi.mock('src/lib/hooks/use-country-code', () => ({
  useCountryCode: () => ({
    data: mocks.country,
    isPending: false,
    isError: false,
  }),
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
vi.mock('../checker/trustline', () => ({
  Trustlines: ({ children }: { children: ReactNode }) => {
    mocks.trustlines()
    return children
  },
}))
vi.mock('~evm/[chainId]/pool/_ui/toggle-zap-card', () => ({
  ToggleZapCard: ({
    onCheckedChange,
  }: { onCheckedChange(value: boolean): void }) => (
    <button type="button" onClick={() => onCheckedChange(true)}>
      Enable zap
    </button>
  ),
}))
vi.mock('src/lib/wagmi/components/token-selector/token-selector', () => ({
  TokenSelector: ({ onSelect }: { onSelect(token: StellarToken): void }) => (
    <>
      {[restricted, xlm].map((token) => (
        <button key={token.id} type="button" onClick={() => onSelect(token)}>
          Select {token.symbol}
        </button>
      ))}
    </>
  ),
}))
vi.mock('src/lib/wagmi/components/web3-input/currency', () => ({
  CurrencyInput: ({
    id,
    value,
    onChange,
  }: {
    id: string
    value: string
    onChange(value: string): void
  }) => (
    <input
      aria-label={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))
vi.mock('~stellar/_common/lib/hooks/pool/use-pool-balances', () => ({
  usePoolBalances: () => ({ data: undefined }),
}))
vi.mock('~stellar/_common/lib/hooks/pool/use-max-paired-amount', () => ({
  useMaxPairedAmount: () => ({ data: undefined }),
}))
vi.mock(
  '~stellar/_common/lib/hooks/pool/use-calculate-dependent-amount',
  () => ({
    useCalculateDependentAmount: () => ({
      data: { amount: '1', status: 'within-range' },
    }),
  }),
)
vi.mock('~stellar/_common/lib/hooks/position/use-my-position', () => ({
  useMyPosition: () => ({ positions: mocks.positions }),
}))
vi.mock('~stellar/_common/lib/hooks/tick/use-tick-range-selector', () => ({
  useTickRangeSelector: () => ({
    tickLower: -60,
    tickUpper: 60,
    defaultLower: -60,
    defaultUpper: 60,
    tickSpacing: 60,
    isTickRangeValid: true,
    setTickLower: mocks.setTickLower,
    setTickUpper: mocks.setTickUpper,
  }),
}))
vi.mock('~stellar/_common/lib/hooks/swap', () => ({
  useAddLiquidity: () => ({ mutate: mocks.add, isPending: false }),
}))
vi.mock('~stellar/_common/lib/hooks/zap/use-zap', () => ({
  useZap: () => ({ mutate: mocks.zap, isPending: false }),
}))
vi.mock('~stellar/_common/lib/hooks/liquidity/use-remove-liquidity', () => ({
  useRemoveLiquidity: () => ({ mutateAsync: mocks.remove, isPending: false }),
}))
vi.mock('~stellar/swap/lib/hooks/use-best-route', () => ({
  useBestRoute: () => ({ route: null, isPending: false }),
}))
vi.mock('~stellar/_common/lib/soroban/pool-helpers', () => ({
  formatPriceBound: (tick: number) => tick.toString(),
}))
vi.mock('../tick-range-selector/tick-range-selector', () => ({
  TickRangeSelector: () => null,
}))
vi.mock('./liquidity-depth-widget', () => ({
  LiquidityDepthWidget: () => null,
}))

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const restricted = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})
const pool: PoolInfo = {
  name: 'XLM/USDC',
  address: usdc.address,
  token0: xlm,
  token1: usdc,
  fee: 3000,
  tickSpacing: 60,
  liquidity: { amount: '1000' },
  reserves: {
    token0: { code: 'XLM', amount: '100' },
    token1: { code: 'USDC', amount: '100' },
  },
  sqrtPriceX96: 1n << 96n,
  tick: 0,
}

let root: Root
let container: HTMLDivElement
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function render(value = pool): void {
  act(() => root.render(<ManageLiquidityCard pool={value} />))
}

function button(label: string): HTMLButtonElement {
  const element = Array.from(container.querySelectorAll('button')).find(
    (element) => element.textContent === label,
  )
  if (!element)
    throw new Error(`Missing button ${label}: ${container.textContent}`)
  return element
}

async function click(label: string): Promise<void> {
  await act(async () => button(label).click())
}

function fill(label: string, value: string): void {
  const input = container.querySelector<HTMLInputElement>(
    `input[aria-label="${label}"]`,
  )
  if (!input) throw new Error(`Missing input ${label}`)
  act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set?.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

async function prepareZap(token: StellarToken): Promise<void> {
  render()
  await click('Enable zap')
  mocks.trustlines.mockClear()
  await click(`Select ${token.symbol}`)
  fill('zap-amount-input', '1')
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')
  mocks.country = 'US'
  mocks.positions = []
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllEnvs()
})

describe('ManageLiquidityCard region checks', () => {
  it('blocks deHYB as an arbitrary zap input before trustlines or execution', async () => {
    await prepareZap(restricted)

    expect(button('deHYB unavailable in your region').disabled).toBe(true)
    await click('deHYB unavailable in your region')
    expect(mocks.trustlines).not.toHaveBeenCalled()
    expect(mocks.zap).not.toHaveBeenCalled()
    expect(mocks.add).not.toHaveBeenCalled()
  })

  it.each([
    { country: 'DE', token: restricted },
    { country: 'US', token: xlm },
  ])(
    'allows $token.symbol zap input in $country',
    async ({ country, token }) => {
      mocks.country = country
      await prepareZap(token)

      expect(button('Zap & Add Liquidity').disabled).toBe(false)
      await click('Zap & Add Liquidity')
      expect(mocks.trustlines).toHaveBeenCalled()
      expect(mocks.zap).toHaveBeenCalledWith(
        expect.objectContaining({ tokenIn: token, token0: xlm, token1: usdc }),
        expect.any(Object),
      )
    },
  )

  it.each(['US', 'DE'])(
    'checks the pool tokens when removing liquidity in %s',
    async (country) => {
      mocks.country = country
      mocks.positions = [
        {
          tokenId: 1,
          token0: restricted,
          token1: usdc,
          liquidity: '1000',
          principalToken0: new Amount(restricted, 10_000_000n),
          principalToken1: new Amount(usdc, 10_000_000n),
          feesToken0: new Amount(restricted, 0n),
          feesToken1: new Amount(usdc, 0n),
          pool: pool.address,
          tickLower: -60,
          tickUpper: 60,
          fee: 3000,
        },
      ]
      render({ ...pool, token0: restricted })
      await click('Remove')

      if (country === 'US') {
        expect(button('deHYB unavailable in your region').disabled).toBe(true)
        await click('deHYB unavailable in your region')
        expect(mocks.remove).not.toHaveBeenCalled()
      } else {
        expect(button('Remove Liquidity').disabled).toBe(false)
        await click('Remove Liquidity')
        expect(mocks.remove).toHaveBeenCalledWith(
          expect.objectContaining({
            token0: restricted,
            token1: usdc,
            liquidity: 1000n,
          }),
        )
      }
    },
  )
})
