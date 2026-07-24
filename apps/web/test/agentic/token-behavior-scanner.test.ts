import { EvmChainId } from 'sushi/evm'
import { describe, expect, it, vi } from 'vitest'
import honeypotTokenFixture from './fixtures/goplus/honeypot-token.json'
import malformedTokenFixture from './fixtures/goplus/malformed-token.json'
import taxedTokenFixture from './fixtures/goplus/taxed-token.json'
import { TESTED_CHAIN_IDS } from './tested-chains'
import {
  createGoPlusTokenBehaviorScanner,
  createGoPlusTokenBehaviorScannerFromEnvironment,
} from './token-behavior-scanner'
import { TOKEN_CORPUS } from './token-corpus'

const sta = TOKEN_CORPUS.find(
  ({ chainId, symbol }) => chainId === EvmChainId.ETHEREUM && symbol === 'STA',
)
if (!sta) throw new Error('STA fixture token is missing from the corpus')

describe('GoPlus token behavior scanner', () => {
  it.each(TESTED_CHAIN_IDS)('supports tested chain %s', async (chainId) => {
    const token = TOKEN_CORPUS.find((entry) => entry.chainId === chainId)
    if (!token) throw new Error(`Missing corpus token for chain ${chainId}`)
    const scan = createGoPlusTokenBehaviorScanner({
      fetch: async () =>
        Response.json({
          code: 1,
          message: 'OK',
          result: { [token.address.toUpperCase()]: {} },
        }),
    })

    await expect(scan(token)).resolves.toMatchObject({ status: 'available' })
  })

  it('normalizes fixture signals and keeps credentials out of artifacts', async () => {
    const request = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        const url = new URL(String(input))
        expect(url.pathname).toBe('/api/v1/token_security/1')
        expect(url.searchParams.get('contract_addresses')).toBe(sta.address)
        expect(new Headers(init?.headers).get('authorization')).toBe(
          'Bearer fixture-secret',
        )
        return Response.json(taxedTokenFixture)
      },
    )
    const scan = createGoPlusTokenBehaviorScanner({
      accessToken: 'fixture-secret',
      fetch: request,
    })

    const result = await scan(sta)

    expect(result).toMatchObject({
      provider: 'goplus',
      providerCode: 1,
      providerMessage: 'OK',
      signals: {
        antiWhale: false,
        buyTaxBps: 30,
        cannotBuy: false,
        cannotSellAll: false,
        hasBlacklist: true,
        honeypot: false,
        personalTaxModifiable: true,
        sellTaxBps: 100,
        taxModifiable: true,
        tradingCooldown: true,
        transferTaxBps: 100,
      },
      status: 'available',
    })
    expect(JSON.stringify(result)).not.toContain('fixture-secret')
  })

  it('preserves severe cannot-trade signals without interpreting provider fields loosely', async () => {
    const scan = createGoPlusTokenBehaviorScanner({
      fetch: async () => Response.json(honeypotTokenFixture),
    })

    await expect(scan(sta)).resolves.toMatchObject({
      signals: {
        buyTaxBps: 10_000,
        cannotBuy: true,
        cannotSellAll: true,
        honeypot: true,
        sellTaxBps: 10_000,
        transferTaxBps: 10_000,
      },
      status: 'available',
    })
  })

  it('turns malformed provider fields into an explicit non-throwing result', async () => {
    const scan = createGoPlusTokenBehaviorScanner({
      fetch: async () => Response.json(malformedTokenFixture),
    })

    await expect(scan(sta)).resolves.toMatchObject({
      failure: {
        kind: 'invalid-response',
        message:
          'GoPlus field buy_tax must be a decimal string between 0 and 1.',
      },
      status: 'unavailable',
    })
  })

  it.each([
    [
      'HTTP failures',
      async () => new Response(null, { status: 429 }),
      { httpStatus: 429, kind: 'http-error' },
    ],
    [
      'provider failures',
      async () =>
        Response.json({ code: 4002, message: 'rate limited', result: {} }),
      { kind: 'provider-error', message: 'GoPlus error 4002: rate limited' },
    ],
    [
      'missing token results',
      async () => Response.json({ code: 1, message: 'OK', result: {} }),
      { kind: 'missing-result' },
    ],
  ] as const)(
    'makes %s explicit and non-fatal',
    async (_label, fetch, failure) => {
      const scan = createGoPlusTokenBehaviorScanner({ fetch })

      await expect(scan(sta)).resolves.toMatchObject({
        failure,
        status: 'unavailable',
      })
    },
  )

  it('redacts a credential repeated by a failed network implementation', async () => {
    const scan = createGoPlusTokenBehaviorScanner({
      accessToken: 'do-not-persist',
      fetch: async (_input, init) => {
        const authorization = new Headers(init?.headers).get('authorization')
        throw new Error(`request failed with Authorization: ${authorization}`)
      },
    })

    const result = await scan(sta)

    expect(result).toMatchObject({ status: 'unavailable' })
    expect(JSON.stringify(result)).not.toContain('do-not-persist')
    expect(JSON.stringify(result)).toContain('[REDACTED]')
  })

  it('bounds a hung provider request with the configured timeout', async () => {
    vi.useFakeTimers()
    try {
      const scan = createGoPlusTokenBehaviorScanner({
        fetch: async (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new Error('fixture request aborted'))
            })
          }),
        timeoutMs: 25,
      })

      const result = scan(sta)
      await vi.advanceTimersByTimeAsync(25)

      await expect(result).resolves.toMatchObject({
        failure: {
          kind: 'network-error',
          message: 'fixture request aborted',
        },
        status: 'unavailable',
      })
    } finally {
      vi.useRealTimers()
    }
  })

  it('reads optional configuration from the harness environment', async () => {
    expect(() =>
      createGoPlusTokenBehaviorScannerFromEnvironment({
        AGENTIC_GOPLUS_TIMEOUT_MS: 'not-a-number',
      }),
    ).toThrow('GoPlus timeout must be a positive integer')
  })
})
