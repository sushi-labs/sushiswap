/** @vitest-environment jsdom */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SimpleSwapExecuteButton } from './simple-swap-execute-button'

const mocks = vi.hoisted(() => ({
  state: vi.fn(),
  balances: vi.fn(),
  checkTrustlineRequired: vi.fn(),
  hasTrustline: vi.fn(),
  execute: vi.fn(),
  country: vi.fn(),
}))
vi.mock('src/lib/hooks/use-country-code', () => ({
  useCountryCode: mocks.country,
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
}))
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [undefined, { slippageTolerance: '0.5' }],
}))
vi.mock('~evm/_common/ui/balance-provider/use-balances', () => ({
  useAmountBalances: mocks.balances,
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))
vi.mock('~evm/_common/ui/balance-provider/use-stellar-balances', () => ({
  invalidateStellarBalances: vi.fn(),
}))
vi.mock('src/lib/wallet/namespaces/stellar/config', () => ({
  getStellarWalletKit: vi.fn(),
}))
vi.mock('@sushiswap/notifications', () => ({
  createErrorToast: vi.fn(),
  createInfoToast: vi.fn(),
  createSuccessToast: vi.fn(),
}))
vi.mock('~stellar/_common/lib/soroban/trustline-helpers', () => ({
  checkTrustlineRequired: mocks.checkTrustlineRequired,
  hasTrustline: mocks.hasTrustline,
  createTrustline: vi.fn(),
}))
vi.mock('~stellar/_common/lib/hooks/swap', () => ({
  useExecuteSwap: () => ({ isPending: false, mutateAsync: mocks.execute }),
  useExecuteMultiHopSwap: () => ({
    isPending: false,
    mutateAsync: mocks.execute,
  }),
}))
vi.mock('~stellar/swap/lib/hooks', () => ({
  useBestRoute: () => ({
    route: { route: [], pools: [], fees: [] },
    isPending: false,
    isFetching: false,
  }),
}))
vi.mock('./simple-swap-provider/simple-swap-provider', () => ({
  useSimpleSwapState: mocks.state,
  useSimpleSwapActions: () => ({
    setAmount: vi.fn(),
    setOutputAmount: vi.fn(),
    setSlippageAmount: vi.fn(),
    setPriceImpact: vi.fn(),
  }),
}))

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const restrictedToken = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})
let container: HTMLDivElement
let root: Root
let client: QueryClient
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

beforeEach(() => {
  vi.resetAllMocks()
  vi.useFakeTimers()
  vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')
  mocks.country.mockReturnValue({
    data: 'US',
    isPending: false,
    isError: false,
  })
  client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  container = document.createElement('div')
  root = createRoot(container)
  mocks.balances.mockReturnValue({
    data: new Map([[xlm.id, new Amount(xlm, 100_000_000n)]]),
    isError: false,
  })
  mocks.checkTrustlineRequired.mockResolvedValue({
    required: true,
    assetCode: usdc.symbol,
    issuer: usdc.issuer,
  })
  mocks.hasTrustline.mockResolvedValue(true)
})
afterEach(() => {
  act(() => root.unmount())
  client.clear()
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

async function render(
  amount: string | null,
  token0 = xlm,
  token1 = usdc,
): Promise<void> {
  mocks.state.mockReturnValue({
    amount,
    token0,
    token1,
    outputAmount: 10_000_000n,
    priceImpact: null,
  })
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <SimpleSwapExecuteButton />
      </QueryClientProvider>,
    )
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1)
  })
}

it.each([null, '', '0', '0.00000001', 'invalid'])(
  'does not check trustlines when the entered amount is %s',
  async (amount) => {
    await render(amount)

    expect(container.textContent).toBe('Enter Amount')
    expect(mocks.checkTrustlineRequired).not.toHaveBeenCalled()
    expect(mocks.hasTrustline).not.toHaveBeenCalled()
  },
)

it.each([
  { balance: 0n, isError: false, label: 'Insufficient Balance' },
  { balance: undefined, isError: false, label: 'Checking Balance' },
  { balance: undefined, isError: true, label: 'Balance unavailable — Retry' },
])(
  'waits for usable input funds: $label',
  async ({ balance, isError, label }) => {
    mocks.balances.mockReturnValue({
      data:
        balance === undefined
          ? undefined
          : new Map([[xlm.id, new Amount(xlm, balance)]]),
      isError,
    })
    await render('1')

    expect(container.textContent).toContain(label)
    expect(mocks.checkTrustlineRequired).not.toHaveBeenCalled()
    expect(mocks.hasTrustline).not.toHaveBeenCalled()
  },
)

it('checks trustlines for a funded positive amount and hides a failed check when the amount is cleared', async () => {
  mocks.hasTrustline.mockRejectedValue(new Error('Horizon unavailable'))
  await render('1')

  expect(mocks.checkTrustlineRequired).toHaveBeenCalledWith(
    usdc.address,
    usdc.symbol,
    usdc.issuer,
  )
  expect(mocks.hasTrustline).toHaveBeenCalledOnce()
  expect(container.textContent).toBe('Trustlines unavailable — Retry')
  expect(mocks.execute).not.toHaveBeenCalled()

  await render('')

  expect(container.textContent).toBe('Enter Amount')
  expect(mocks.checkTrustlineRequired).toHaveBeenCalledOnce()
  expect(mocks.hasTrustline).toHaveBeenCalledOnce()
})

it.each(['input', 'output'] as const)(
  'blocks a restricted %s token in the US before trustlines or swap execution',
  async (side) => {
    const token0 = side === 'input' ? restrictedToken : xlm
    const token1 = side === 'output' ? restrictedToken : usdc
    mocks.balances.mockReturnValue({
      data: new Map([[token0.id, new Amount(token0, 100_000_000n)]]),
      isError: false,
    })
    await render('1', token0, token1)

    expect(container.textContent).toBe('deHYB unavailable in your region')
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    act(() => button?.click())
    expect(mocks.checkTrustlineRequired).not.toHaveBeenCalled()
    expect(mocks.execute).not.toHaveBeenCalled()
  },
)

it('allows a restricted token swap outside the US', async () => {
  mocks.country.mockReturnValue({
    data: 'DE',
    isPending: false,
    isError: false,
  })
  mocks.checkTrustlineRequired.mockResolvedValue({ required: false })
  await render('1', xlm, restrictedToken)

  expect(container.textContent).toBe('Swap')
  await act(async () => container.querySelector('button')?.click())
  expect(mocks.execute).toHaveBeenCalledOnce()
})
