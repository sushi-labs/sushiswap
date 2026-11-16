import { Amount, Percent } from 'sushi'
import { EvmNative } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import {
  createPerpsStep,
  createPreparedPerpsStep,
  wallet,
} from './test-fixtures'
import {
  useLifiPerpsDepositRoutes,
  useLifiPerpsDepositStep,
} from './use-lifi-perps-deposit'

interface QueryOptions {
  queryFn: (context: { signal: AbortSignal }) => Promise<unknown>
  enabled: boolean
}

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn<(options: QueryOptions) => unknown>(),
  fetch: vi.fn<typeof fetch>(),
}))
vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }))

const slippage = new Percent({ numerator: 50, denominator: 10_000 })

function lastQuery(): QueryOptions {
  const options = mocks.useQuery.mock.lastCall?.[0]
  if (!options) throw new Error('Expected a perps deposit query.')
  return options
}

describe('perps hooks use shared LI.FI APIs', () => {
  beforeEach(() => {
    mocks.useQuery.mockReset()
    mocks.fetch.mockReset()
    vi.stubGlobal('fetch', mocks.fetch)
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'quotes configured source %s with an explicit perps destination',
    async (chainId) => {
      mocks.fetch.mockResolvedValue(Response.json({ routes: [] }))
      const fromAmount = Amount.fromHuman(EvmNative.fromChainId(chainId), '1')
      useLifiPerpsDepositRoutes({ fromAmount, address: wallet, slippage })
      const signal = new AbortController().signal

      expect(await lastQuery().queryFn({ signal })).toEqual([])
      const [input, init] = mocks.fetch.mock.calls[0]
      const url = new URL(String(input), 'http://localhost')
      expect(url.pathname).toBe('/api/cross-chain/routes')
      expect(Object.fromEntries(url.searchParams)).toEqual({
        destination: 'perps',
        fromChainId: String(chainId),
        fromAmount: fromAmount.amount.toString(),
        fromTokenAddress: '0x0000000000000000000000000000000000000000',
        fromAddress: wallet,
        slippage: '0.005',
      })
      expect(init?.signal).toBe(signal)
    },
  )

  it('prepares via the shared step API while keeping the protocol payload intact', async () => {
    const step = createPerpsStep()
    const prepared = createPreparedPerpsStep(step)
    mocks.fetch.mockResolvedValue(Response.json(prepared))
    useLifiPerpsDepositStep({ step })
    const signal = new AbortController().signal

    expect(await lastQuery().queryFn({ signal })).toEqual(prepared)
    const [input, init] = mocks.fetch.mock.calls[0]
    const url = new URL(String(input), 'http://localhost')
    expect(url.pathname).toBe('/api/cross-chain/step')
    expect(url.searchParams.get('destination')).toBe('perps')
    expect(init?.method).toBe('POST')
    expect(init?.signal).toBe(signal)
    expect(JSON.parse(String(init?.body))).toEqual(step)
  })

  it('rejects ordinary wallet-delivery data from the shared endpoint', async () => {
    const prepared = createPreparedPerpsStep()
    mocks.fetch.mockResolvedValue(
      Response.json({
        ...prepared,
        action: { ...prepared.action, toChainId: 42161 },
      }),
    )
    useLifiPerpsDepositStep({ step: createPerpsStep() })

    await expect(
      lastQuery().queryFn({ signal: new AbortController().signal }),
    ).rejects.toThrow()
  })
})
