import type { EvmTxHash } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type LifiPerpsDepositStatus,
  classifyLifiPerpsDepositStatus,
  useLifiPerpsDepositStatus,
} from './use-lifi-perps-deposit-status'

type QueryOptions = {
  queryKey: readonly unknown[]
  queryFn: (context: { signal: AbortSignal }) => Promise<LifiPerpsDepositStatus>
  enabled: boolean
  refetchInterval: (query: {
    state: { data?: LifiPerpsDepositStatus }
  }) => number | false
}

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn<(options: QueryOptions) => unknown>(),
  fetch: vi.fn<typeof fetch>(),
}))
vi.mock('@tanstack/react-query', () => ({ useQuery: mocks.useQuery }))

const recipient = '0x0000000000000000000000000000000000000001'
const txHash: EvmTxHash =
  '0x1234567890123456789012345678901234567890123456789012345678901234'
const expectation = { recipient, minimumAmount: '99000000' } as const

function completedResponse() {
  return {
    status: 'DONE',
    substatus: 'COMPLETED',
    toAddress: recipient,
    receiving: {
      chainId: 1337,
      amount: '99500000',
      txHash,
      token: {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        chainId: 1337,
        symbol: 'USDC',
        decimals: 6,
      },
    },
    lifiExplorerLink: 'https://scan.li.fi/tx/example',
  }
}

function lastQuery(): QueryOptions {
  const query = mocks.useQuery.mock.lastCall?.[0]
  if (!query) throw new Error('Expected a deposit status query.')
  return query
}

describe('classifyLifiPerpsDepositStatus', () => {
  it('accepts a perps deposit for the intended recipient above the minimum', () => {
    const response = completedResponse()
    expect(classifyLifiPerpsDepositStatus(response, expectation)).toMatchObject(
      {
        state: 'completed',
        receiving: response.receiving,
        lifiExplorerLink: response.lifiExplorerLink,
      },
    )
  })

  it.each(['PENDING', 'NOT_FOUND'])('keeps %s pending', (status) => {
    expect(classifyLifiPerpsDepositStatus({ status }, expectation).state).toBe(
      'pending',
    )
  })

  it.each([
    ['DONE', 'PARTIAL', 'partial'],
    ['DONE', 'REFUNDED', 'refunded'],
    ['FAILED', 'REFUNDED', 'refunded'],
    ['FAILED', 'SLIPPAGE_EXCEEDED', 'failed'],
  ])('preserves %s/%s recovery information', (status, substatus, state) => {
    const response = {
      ...completedResponse(),
      status,
      substatus,
      substatusMessage: 'Funds were returned on the source chain.',
    }
    expect(classifyLifiPerpsDepositStatus(response, expectation)).toMatchObject(
      {
        state,
        receiving: response.receiving,
        substatusMessage: response.substatusMessage,
      },
    )
  })

  it('does not mistake Arbitrum wallet delivery for a perps deposit', () => {
    const response = completedResponse()
    response.receiving.chainId = 42161
    response.receiving.token.chainId = 42161
    expect(classifyLifiPerpsDepositStatus(response, expectation).state).toBe(
      'unverified',
    )
  })

  it('does not accept spot USDC or another recipient', () => {
    const response = completedResponse()
    response.receiving.token.address = '0x6d1e7cde53ba9467b783cb7c530ce054'
    expect(classifyLifiPerpsDepositStatus(response, expectation).state).toBe(
      'unverified',
    )
    expect(
      classifyLifiPerpsDepositStatus(
        {
          ...completedResponse(),
          toAddress: '0x0000000000000000000000000000000000000002',
        },
        expectation,
      ).state,
    ).toBe('unverified')
  })

  it.each(['98999999', '0', '-1', '1e8', 'invalid'])(
    'rejects an invalid or insufficient delivered amount: %s',
    (amount) => {
      const response = completedResponse()
      response.receiving.amount = amount
      expect(classifyLifiPerpsDepositStatus(response, expectation).state).toBe(
        'unverified',
      )
    },
  )

  it('requires destination, recipient, token decimals and expected amount evidence', () => {
    const response = completedResponse()
    for (const value of [
      { ...response, toAddress: undefined },
      { ...response, receiving: undefined },
      {
        ...response,
        receiving: {
          ...response.receiving,
          token: { ...response.receiving.token, decimals: undefined },
        },
      },
      { ...response, substatus: undefined },
      { ...response, status: 'INVALID' },
      null,
      { status: 1 },
    ]) {
      expect(classifyLifiPerpsDepositStatus(value, expectation).state).toBe(
        'unverified',
      )
    }
    expect(classifyLifiPerpsDepositStatus(response, {}).state).toBe(
      'unverified',
    )
  })

  it('handles large integer amounts without floating point rounding', () => {
    const response = completedResponse()
    response.receiving.amount = '9007199254740992'
    expect(
      classifyLifiPerpsDepositStatus(response, {
        recipient,
        minimumAmount: '9007199254740993',
      }).state,
    ).toBe('unverified')
  })
})

describe('useLifiPerpsDepositStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('fetch', mocks.fetch)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('polls the actual source and perps destination and forwards cancellation', async () => {
    const signal = new AbortController().signal
    mocks.fetch.mockResolvedValue(
      new Response(JSON.stringify(completedResponse())),
    )
    useLifiPerpsDepositStatus({
      txHash,
      fromChainId: 8453,
      bridge: 'polymerStandard',
      ...expectation,
    })
    expect(lastQuery().enabled).toBe(true)
    await expect(lastQuery().queryFn({ signal })).resolves.toMatchObject({
      state: 'completed',
    })
    const [url, options] = mocks.fetch.mock.calls[0]
    expect(url).toBeInstanceOf(URL)
    expect(String(url)).toContain(
      'fromChain=8453&toChain=1337&bridge=polymerStandard',
    )
    expect(options?.signal).toBe(signal)
  })

  it('treats indexing 404/code 1003 as pending but retries other HTTP errors', async () => {
    useLifiPerpsDepositStatus({ txHash, fromChainId: 1, ...expectation })
    const context = { signal: new AbortController().signal }
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 1003 }), { status: 404 }),
    )
    await expect(lastQuery().queryFn(context)).resolves.toEqual({
      state: 'pending',
    })
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 1000 }), { status: 404 }),
    )
    await expect(lastQuery().queryFn(context)).rejects.toThrow('HTTP 404')
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Rate limited' }), {
        status: 429,
      }),
    )
    await expect(lastQuery().queryFn(context)).rejects.toThrow('HTTP 429')
  })

  it('separates queries by recipient and amount and stops polling only on verified or recovery outcomes', () => {
    useLifiPerpsDepositStatus({ txHash, fromChainId: 4663, ...expectation })
    const originalKey = lastQuery().queryKey
    useLifiPerpsDepositStatus({
      txHash,
      fromChainId: 4663,
      recipient,
      minimumAmount: '100000000',
    })
    expect(lastQuery().queryKey).not.toEqual(originalKey)
    for (const state of ['pending', 'unverified'] as const) {
      expect(lastQuery().refetchInterval({ state: { data: { state } } })).toBe(
        10_000,
      )
    }
    for (const state of [
      'completed',
      'partial',
      'refunded',
      'failed',
    ] as const) {
      expect(lastQuery().refetchInterval({ state: { data: { state } } })).toBe(
        false,
      )
    }
    useLifiPerpsDepositStatus({ fromChainId: 4663 })
    expect(lastQuery().enabled).toBe(false)
  })
})
