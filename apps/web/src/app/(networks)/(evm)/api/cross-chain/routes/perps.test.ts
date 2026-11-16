import { NextRequest } from 'next/server'
import { EVM_UI_FEE_DECIMAL, XSWAP_STABLE_UI_FEE_DECIMAL } from 'src/config'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
  lifiPerpsRoutesResponseSchema,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import {
  createPerpsRoute,
  otherWallet,
  wallet,
} from 'src/lib/perps/deposit/test-fixtures'
import { STABLES } from 'sushi/evm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS } from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { GET } from './route'

function quoteRequest(params: Record<string, string> = {}): NextRequest {
  const route = createPerpsRoute()
  return new NextRequest(
    `http://localhost/api/cross-chain/routes?${new URLSearchParams({
      destination: 'perps',
      fromChainId: String(route.fromChainId),
      fromAmount: route.fromAmount,
      fromTokenAddress: route.fromToken.address,
      fromAddress: wallet,
      slippage: '0.005',
      ...params,
    })}`,
  )
}

describe('direct perps deposit routes', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each(ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)(
    'fixes the perps destination and fastest execution policy for configured source %s',
    async (chainId) => {
      const route = createPerpsRoute(chainId)
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ routes: [route] }))
      vi.stubGlobal('fetch', fetchMock)
      const response = await GET(
        quoteRequest({
          fromChainId: String(chainId),
          fromTokenAddress: route.fromToken.address,
        }),
      )
      expect(response.status).toBe(200)
      const result = lifiPerpsRoutesResponseSchema.parse(await response.json())
      expect(result.routes).toHaveLength(1)
      const body = fetchMock.mock.calls[0][1]?.body
      if (typeof body !== 'string') throw new Error('Expected JSON')
      const stable = STABLES[chainId]?.some(
        (token) =>
          token.address.toLowerCase() === route.fromToken.address.toLowerCase(),
      )
      expect(JSON.parse(body)).toMatchObject({
        fromChainId: chainId,
        toChainId: LIFI_PERPS_CHAIN_ID,
        toTokenAddress: LIFI_PERPS_USDC_ADDRESS,
        fromAddress: wallet,
        toAddress: wallet,
        options: {
          order: 'FASTEST',
          exchanges: { allow: ['sushiswap'] },
          allowSwitchChain: false,
          allowDestinationCall: true,
          fee: stable ? XSWAP_STABLE_UI_FEE_DECIMAL : EVM_UI_FEE_DECIMAL,
        },
      })
    },
  )

  it('sorts eligible routes by duration and independently drops unsafe routes', async () => {
    const slow = createPerpsRoute()
    slow.steps[0].estimate.executionDuration = 1080
    const fast = createPerpsRoute()
    fast.id = 'fast'
    fast.steps[0].estimate.executionDuration = 16
    const source = createPerpsRoute()
    const invalid = [
      { ...source, containsSwitchChain: true },
      { ...source, steps: [source.steps[0], source.steps[0]] },
      { ...source, toChainId: 999 },
      { ...source, toToken: { ...source.toToken, decimals: 18 } },
      { ...source, toAddress: otherWallet },
      { ...source, steps: [{ ...source.steps[0], executionType: 'message' }] },
      {
        ...source,
        steps: [
          {
            ...source.steps[0],
            includedSteps: [
              {
                ...source.steps[0].includedSteps[0],
                transactionRequest: { chainId: 999, to: otherWallet },
              },
            ],
          },
        ],
      },
      { id: 'malformed' },
    ]
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(Response.json({ routes: [slow, ...invalid, fast] })),
    )
    const response = await GET(quoteRequest())
    const result = lifiPerpsRoutesResponseSchema.parse(await response.json())
    expect(result.routes.map((route) => route.id)).toEqual(['fast', slow.id])
    expect(result.routes[0].step.includedSteps[0].protocolData).toEqual({
      opaqueField: 'preserve-this',
    })
  })

  it.each<Record<string, string>>([
    { destination: 'unsupported' },
    { fromChainId: '1337' },
    { fromAmount: '0' },
    { fromAmount: '-1' },
    { fromAddress: 'bad-address' },
    { slippage: '-0.1' },
    { toAddress: otherWallet },
  ])('rejects invalid request before contacting LI.FI: %o', async (params) => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect((await GET(quoteRequest(params))).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not accept HyperCore as an ordinary swap destination', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const request = quoteRequest({
      toChainId: String(LIFI_PERPS_CHAIN_ID),
      toTokenAddress: LIFI_PERPS_USDC_ADDRESS,
      toAddress: wallet,
    })
    request.nextUrl.searchParams.delete('destination')

    await expect(GET(request)).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not misrepresent upstream outages as no routes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ code: 1002 }, { status: 404 }))
      .mockResolvedValueOnce(
        Response.json({ message: 'rate limited' }, { status: 429 }),
      )
      .mockResolvedValueOnce(Response.json({ unexpected: true }))
    vi.stubGlobal('fetch', fetchMock)
    expect(await (await GET(quoteRequest())).json()).toEqual({ routes: [] })
    expect((await GET(quoteRequest())).status).toBe(429)
    expect((await GET(quoteRequest())).status).toBe(502)
  })
})
