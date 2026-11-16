import { NextRequest } from 'next/server'
import { lifiPerpsPreparedStepSchema } from 'src/lib/perps/deposit/lifi-perps-schemas'
import {
  createPerpsStep,
  createPreparedPerpsStep,
  otherWallet,
} from 'src/lib/perps/deposit/test-fixtures'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { POST } from './route'

function stepRequest(step: unknown): NextRequest {
  return new NextRequest(
    'http://localhost/api/cross-chain/step?destination=perps',
    {
      method: 'POST',
      body: JSON.stringify(step),
    },
  )
}

describe('direct perps deposit preparation', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'preserves protocol payload and prepares only on configured source %s',
    async (chainId) => {
      const step = createPerpsStep(chainId)
      const prepared = createPreparedPerpsStep(step)
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json(prepared))
      vi.stubGlobal('fetch', fetchMock)
      const response = await POST(stepRequest(step))
      expect(response.status).toBe(200)
      expect(lifiPerpsPreparedStepSchema.parse(await response.json())).toEqual(
        prepared,
      )
      const body = fetchMock.mock.calls[0][1]?.body
      if (typeof body !== 'string') throw new Error('Expected JSON')
      expect(JSON.parse(body)).toMatchObject({
        integrator: 'sushi',
        includedSteps: step.includedSteps,
      })
      expect(prepared.transactionRequest.chainId).toBe(chainId)
    },
  )

  it('rejects an unknown destination mode without preparing a transaction', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const request = stepRequest(createPerpsStep())
    request.nextUrl.searchParams.set('destination', 'unsupported')

    expect((await POST(request)).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requires the perps selector instead of treating HyperCore as an EVM destination', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const request = stepRequest(createPerpsStep())
    request.nextUrl.searchParams.delete('destination')

    await expect(POST(request)).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('re-prepares a supplied transaction rather than forwarding its calldata', async () => {
    const prepared = createPreparedPerpsStep()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(prepared))
    vi.stubGlobal('fetch', fetchMock)

    expect((await POST(stepRequest(prepared))).status).toBe(200)
    const body = fetchMock.mock.calls[0][1]?.body
    if (typeof body !== 'string') throw new Error('Expected JSON')
    expect(JSON.parse(body)).not.toHaveProperty('transactionRequest')
  })

  it.each(['destination', 'recipient', 'source', 'message'])(
    'rejects invalid %s input before contacting LI.FI',
    async (field) => {
      const step = createPerpsStep()
      const input =
        field === 'destination'
          ? { ...step, action: { ...step.action, toChainId: 999 } }
          : field === 'recipient'
            ? { ...step, action: { ...step.action, toAddress: otherWallet } }
            : field === 'source'
              ? { ...step, action: { ...step.action, fromChainId: 1337 } }
              : { ...step, executionType: 'message' }
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      expect((await POST(stepRequest(input))).status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it.each([
    'chain',
    'sender',
    'calldata',
    'recipient',
    'amount',
    'minimum',
    'approval',
  ])('rejects changed or unsafe prepared %s', async (field) => {
    const step = createPerpsStep()
    const prepared = createPreparedPerpsStep(step)
    const response =
      field === 'chain'
        ? {
            ...prepared,
            transactionRequest: {
              ...prepared.transactionRequest,
              chainId: 999,
            },
          }
        : field === 'sender'
          ? {
              ...prepared,
              transactionRequest: {
                ...prepared.transactionRequest,
                from: otherWallet,
              },
            }
          : field === 'calldata'
            ? {
                ...prepared,
                transactionRequest: {
                  ...prepared.transactionRequest,
                  data: 'not-hex',
                },
              }
            : field === 'recipient'
              ? {
                  ...prepared,
                  action: { ...prepared.action, toAddress: otherWallet },
                }
              : field === 'amount'
                ? {
                    ...prepared,
                    action: { ...prepared.action, fromAmount: '200000000' },
                  }
                : field === 'minimum'
                  ? {
                      ...prepared,
                      estimate: {
                        ...prepared.estimate,
                        toAmountMin: '97000000',
                      },
                    }
                  : {
                      ...prepared,
                      estimate: {
                        ...prepared.estimate,
                        approvalAddress: otherWallet,
                      },
                    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(response)))
    expect((await POST(stepRequest(step))).status).toBe(502)
  })

  it('preserves HTTP failure status for retry handling', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({}, { status: 429 })),
    )
    expect((await POST(stepRequest(createPerpsStep()))).status).toBe(429)
  })
})
