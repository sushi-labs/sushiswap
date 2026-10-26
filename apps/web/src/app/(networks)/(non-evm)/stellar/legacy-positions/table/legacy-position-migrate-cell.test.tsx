/** @vitest-environment jsdom */

import { type ButtonHTMLAttributes, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { IPositionRowData } from '~stellar/_common/ui/pools/positions-table/positions-table'
import { LegacyPositionMigrateCell } from './legacy-position-migrate-cell'

const mocks = vi.hoisted(() => ({
  country: 'US',
  remove: vi.fn(),
  create: vi.fn(),
  add: vi.fn(),
  save: vi.fn(),
}))

vi.mock('@sushiswap/hooks', () => ({
  useLocalStorage: () => [{}, mocks.save],
}))
vi.mock('@sushiswap/notifications', () => ({ createErrorToast: vi.fn() }))
vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    disabled,
    onClick,
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}))
vi.mock('src/lib/hooks/use-country-code', () => ({
  useCountryCode: () => ({
    data: mocks.country,
    isPending: false,
    isError: false,
  }),
}))
vi.mock('~stellar/_common/lib/hooks', () => ({
  useAddLiquidity: () => ({ mutateAsync: mocks.add }),
  useCreateAndInitializePool: () => ({ mutateAsync: mocks.create }),
  useGetPool: () => ({ data: null }),
  useRemoveLiquidity: () => ({ mutateAsync: mocks.remove }),
}))
vi.mock('~stellar/_common/lib/hooks/pool/use-pool-initialized', () => ({
  usePoolInitialized: () => ({ data: false }),
}))
vi.mock('~stellar/_common/lib/soroban', () => ({
  getPoolInfo: async () => ({ sqrtPriceX96: 1n << 96n }),
}))
vi.mock('~stellar/providers', () => ({
  useStellarWallet: () => ({
    connectedAddress:
      'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
    signTransaction: vi.fn(),
    signAuthEntry: vi.fn(),
  }),
}))

const dehyb = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const xlm = STELLAR_XLM[StellarChainId.STELLAR]
let container: HTMLDivElement
let root: Root
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')
  mocks.country = 'US'
  mocks.create.mockResolvedValue({ result: { poolAddress: usdc.address } })
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  vi.unstubAllEnvs()
})

function render(token0: StellarToken, token1: StellarToken): HTMLButtonElement {
  const data: IPositionRowData = {
    tokenId: 1,
    token0,
    token1,
    liquidity: '100',
    principalToken0: new Amount(token0, 10_000_000n),
    principalToken1: new Amount(token1, 10_000_000n),
    feesToken0: new Amount(token0, 0n),
    feesToken1: new Amount(token1, 0n),
    pool: usdc.address,
    tickLower: -60,
    tickUpper: 60,
    fee: 3000,
  }
  act(() => root.render(<LegacyPositionMigrateCell data={data} />))
  const button = container.querySelector('button')
  if (!button) throw new Error('Missing migration button')
  return button
}

it.each([
  [dehyb, usdc],
  [usdc, dehyb],
])(
  'blocks US migration before withdrawing either restricted pair',
  async (token0, token1) => {
    const button = render(token0, token1)
    expect(button.textContent).toBe('deHYB unavailable in your region')
    expect(button.disabled).toBe(true)
    await act(async () => button.click())
    expect(mocks.remove).not.toHaveBeenCalled()
    expect(mocks.create).not.toHaveBeenCalled()
    expect(mocks.add).not.toHaveBeenCalled()
    expect(mocks.save).not.toHaveBeenCalled()
  },
)

it.each([
  { country: 'CA', token0: dehyb },
  { country: 'US', token0: xlm },
])('permits eligible migration in $country', async ({ country, token0 }) => {
  mocks.country = country
  const button = render(token0, usdc)
  expect(button.textContent).toBe('Migrate')
  expect(button.disabled).toBe(false)
  await act(async () => button.click())
  expect(mocks.remove).toHaveBeenCalledOnce()
  expect(mocks.create).toHaveBeenCalledOnce()
  expect(mocks.add).toHaveBeenCalledOnce()
})
