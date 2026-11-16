import { NextRequest } from 'next/server'
import { SvmChainId } from 'sushi/svm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LIFI_SOLANA_CHAIN_ID } from '../schemas'
import {
  createSolanaSwapStep,
  evmSwapStep,
  swapRecipient,
  swapRouter,
  swapSender,
} from '../test-fixtures'
import { POST } from './route'

const evmTransaction = {
  from: swapSender,
  to: swapRouter,
  data: '0x12345678',
  value: '0x0',
  gasPrice: '0x3b9aca00',
}

function request(step: unknown): NextRequest {
  return new NextRequest('http://localhost/api/cross-chain/step', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(step),
  })
}

describe('LI.FI normal swap step contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('prepares the existing raw step body with Sushi authentication and preserves its source transaction', async () => {
    vi.stubEnv('LIFI_API_KEY', 'test-lifi-api-key')
    const input = { ...evmSwapStep, integrator: 'caller-integrator' }
    const prepared = {
      ...evmSwapStep,
      integrator: 'sushi',
      transactionRequest: evmTransaction,
    }
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(prepared))
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(request(input))

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://li.quest/v1/advanced/stepTransaction'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-lifi-api-key': 'test-lifi-api-key',
        },
      }),
    )
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
      ...evmSwapStep,
      integrator: 'sushi',
    })
    const output = await response.json()
    expect(output).toEqual(prepared)
    expect(output.action.toAddress).toBe(swapRecipient)
    expect(output.transactionRequest).toEqual(evmTransaction)
    expect(response.headers.get('Cache-Control')).toBe(
      's-maxage=8, stale-while-revalidate=10',
    )
  })

  it.each(['source', 'destination'] as const)(
    'preserves Solana %s normalization and the source transaction format',
    async (direction) => {
      const input = createSolanaSwapStep(direction, 'sushi')
      const lifiStep = createSolanaSwapStep(direction, 'lifi')
      const transactionRequest =
        direction === 'source'
          ? { data: 'serialized-solana-transaction' }
          : evmTransaction
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({
          ...lifiStep,
          transactionRequest,
        }),
      )
      vi.stubGlobal('fetch', fetchMock)

      const response = await POST(request(input))

      expect(response.status).toBe(200)
      const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))
      expect(body).toEqual({ ...lifiStep, integrator: 'sushi' })
      expect(
        body.action[direction === 'source' ? 'fromChainId' : 'toChainId'],
      ).toBe(LIFI_SOLANA_CHAIN_ID)
      const output = await response.json()
      expect(output.action).toEqual(input.action)
      expect(output.includedSteps).toEqual(input.includedSteps)
      expect(
        output.action[direction === 'source' ? 'fromChainId' : 'toChainId'],
      ).toBe(SvmChainId.SOLANA)
      expect(output.transactionRequest).toEqual(transactionRequest)
    },
  )

  it('keeps normal swap execution types and refreshed estimates separate from perps restrictions', async () => {
    const step = {
      ...evmSwapStep,
      executionType: 'message',
      typedData: [{ primaryType: 'Order', message: { amount: '100000000' } }],
    }
    const prepared = {
      ...step,
      estimate: {
        ...step.estimate,
        toAmount: '98500000',
        toAmountMin: '98007500',
      },
    }
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(Response.json(prepared)),
    )

    const response = await POST(request(step))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(prepared)
  })
})
