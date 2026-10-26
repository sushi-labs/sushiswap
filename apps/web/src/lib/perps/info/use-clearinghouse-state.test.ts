import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClearinghouseState } from './use-clearinghouse-state'

type QueryOptions = {
  queryKey: readonly unknown[]
  queryFn: (context: { signal: AbortSignal }) => Promise<unknown>
  enabled: boolean
}

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn<(options: QueryOptions) => unknown>(),
  clearinghouseState: vi.fn(),
  transport: {},
}))

vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }))
vi.mock('@nktkas/hyperliquid/api/info', () => ({
  clearinghouseState: mocks.clearinghouseState,
}))
vi.mock('../transports', () => ({ hlHttpTransport: mocks.transport }))

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountAddress = '0x0000000000000000000000000000000000000005'

function lastQuery(): QueryOptions {
  const query = mocks.useQuery.mock.lastCall?.[0]
  if (!query) throw new Error('Expected a clearinghouse query.')
  return query
}

describe('useClearinghouseState', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('refreshes the source sub-account on the selected HIP-3 DEX and forwards cancellation', async () => {
    const signal = new AbortController().signal
    const state = { withdrawable: '12.345678' }
    mocks.clearinghouseState.mockResolvedValue(state)

    useClearinghouseState({ address: subAccountAddress, dex: 'xyz' })

    expect(lastQuery().enabled).toBe(true)
    await expect(lastQuery().queryFn({ signal })).resolves.toBe(state)
    expect(mocks.clearinghouseState).toHaveBeenCalledWith(
      { transport: mocks.transport },
      { user: subAccountAddress, dex: 'xyz' },
      signal,
    )
  })

  it('defaults to the native perps DEX', async () => {
    const signal = new AbortController().signal
    useClearinghouseState({ address: masterAddress })

    expect(lastQuery().queryKey).toEqual([
      'useClearinghouseState',
      masterAddress,
      '',
    ])
    await lastQuery().queryFn({ signal })
    expect(mocks.clearinghouseState).toHaveBeenCalledWith(
      { transport: mocks.transport },
      { user: masterAddress, dex: '' },
      signal,
    )
  })

  it('separates cached balances by both account and DEX', () => {
    useClearinghouseState({ address: subAccountAddress })
    const nativeKey = lastQuery().queryKey
    useClearinghouseState({ address: subAccountAddress, dex: 'xyz' })
    const subDexKey = lastQuery().queryKey
    useClearinghouseState({ address: masterAddress, dex: 'xyz' })
    const masterDexKey = lastQuery().queryKey

    expect(subDexKey).toEqual([
      'useClearinghouseState',
      subAccountAddress,
      'xyz',
    ])
    expect(subDexKey).not.toEqual(nativeKey)
    expect(subDexKey).not.toEqual(masterDexKey)
  })

  it('disables the query and rejects a refresh without a source account', () => {
    useClearinghouseState({ dex: 'xyz' })

    expect(lastQuery().enabled).toBe(false)
    expect(() =>
      lastQuery().queryFn({ signal: new AbortController().signal }),
    ).toThrow('Account address is required.')
    expect(mocks.clearinghouseState).not.toHaveBeenCalled()
  })
})
