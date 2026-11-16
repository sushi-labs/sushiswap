import { NextRequest } from 'next/server'
import { getNativeAddress } from 'sushi'
import { EvmChainId, SUSHI, USDC } from 'sushi/evm'
import { SvmChainId, WSOL } from 'sushi/svm'
import { getAddress } from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LIFI_SOLANA_CHAIN_ID } from '../schemas'
import {
  createSolanaSwapStep,
  evmSwapStep,
  swapRecipient,
  swapSender,
} from '../test-fixtures'
import { GET } from './route'

const ethereum = EvmChainId.ETHEREUM
const arbitrum = EvmChainId.ARBITRUM
const sushiEthereum = SUSHI[ethereum].address
const sushiArbitrum = SUSHI[arbitrum].address

interface FeeCase {
  name: string
  params: Record<string, string>
  fee: number
}

describe('LI.FI route UI fees', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each<FeeCase>([
    {
      name: 'waives the fee for SUSHI to SUSHI',
      params: {},
      fee: 0,
    },
    {
      name: 'waives the fee in the reverse direction',
      params: {
        fromChainId: arbitrum.toString(),
        fromTokenAddress: sushiArbitrum,
        toChainId: ethereum.toString(),
        toTokenAddress: sushiEthereum,
      },
      fee: 0,
    },
    {
      name: 'recognizes checksummed SUSHI addresses on both chains',
      params: {
        fromTokenAddress: getAddress(sushiEthereum),
        toTokenAddress: getAddress(sushiArbitrum),
      },
      fee: 0,
    },
    {
      name: 'keeps the standard fee for SUSHI to another token',
      params: { toTokenAddress: USDC[arbitrum].address },
      fee: 0.0035,
    },
    {
      name: 'keeps the standard fee for another token to SUSHI',
      params: { fromTokenAddress: USDC[ethereum].address },
      fee: 0.0035,
    },
    {
      name: 'keeps the reduced fee for stablecoin to stablecoin',
      params: {
        fromTokenAddress: USDC[ethereum].address,
        toTokenAddress: USDC[arbitrum].address,
      },
      fee: 0.0002,
    },
    {
      name: 'keeps the standard fee for native currency to SUSHI',
      params: { fromTokenAddress: getNativeAddress(ethereum) },
      fee: 0.0035,
    },
    {
      name: 'requires the source SUSHI address to match its chain',
      params: { fromTokenAddress: sushiArbitrum },
      fee: 0.0035,
    },
    {
      name: 'requires the destination SUSHI address to match its chain',
      params: { toTokenAddress: sushiEthereum },
      fee: 0.0035,
    },
    {
      name: 'keeps the standard fee when the source chain has no SUSHI entry',
      params: { fromChainId: EvmChainId.BASE.toString() },
      fee: 0.0035,
    },
    {
      name: 'keeps the standard fee when the destination chain has no SUSHI entry',
      params: { toChainId: EvmChainId.BASE.toString() },
      fee: 0.0035,
    },
    {
      name: 'keeps the standard fee for Solana to SUSHI',
      params: {
        fromChainId: SvmChainId.SOLANA.toString(),
        fromTokenAddress: WSOL[SvmChainId.SOLANA].address,
      },
      fee: 0.0035,
    },
    {
      name: 'keeps the standard fee for SUSHI to Solana',
      params: {
        toChainId: SvmChainId.SOLANA.toString(),
        toTokenAddress: WSOL[SvmChainId.SOLANA].address,
      },
      fee: 0.0035,
    },
  ])('$name', async ({ params, fee }) => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ routes: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const searchParams = new URLSearchParams({
      fromChainId: ethereum.toString(),
      fromTokenAddress: sushiEthereum,
      toChainId: arbitrum.toString(),
      toTokenAddress: sushiArbitrum,
      fromAmount: '1000000000000000000',
      slippage: '0.005',
      ...params,
    })

    const response = await GET(
      new NextRequest(
        `http://localhost/api/cross-chain/routes?${searchParams}`,
      ),
    )

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://li.quest/v1/advanced/routes'),
      expect.objectContaining({ method: 'POST' }),
    )
    const body = fetchMock.mock.calls[0][1]?.body
    if (typeof body !== 'string') {
      throw new Error('Expected a JSON request body for LI.FI')
    }
    expect(JSON.parse(body)).toMatchObject({
      fromTokenAddress: searchParams.get('fromTokenAddress'),
      toTokenAddress: searchParams.get('toTokenAddress'),
      options: { integrator: 'sushi', fee },
    })
  })
})

describe('LI.FI normal swap route contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  function request(params: Record<string, string> = {}): NextRequest {
    return new NextRequest(
      `http://localhost/api/cross-chain/routes?${new URLSearchParams({
        fromChainId: String(ethereum),
        fromTokenAddress: USDC[ethereum].address,
        fromAddress: swapSender,
        toChainId: String(arbitrum),
        toTokenAddress: USDC[arbitrum].address,
        toAddress: swapRecipient,
        fromAmount: '100000000',
        slippage: '0.005',
        ...params,
      })}`,
    )
  }

  it.each([undefined, 'FASTEST'] as const)(
    'preserves route ordering for order=%s and Sushi request options',
    async (order) => {
      vi.stubEnv('LIFI_API_KEY', 'test-lifi-api-key')
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ routes: [] }))
      vi.stubGlobal('fetch', fetchMock)

      const response = await GET(request(order ? { order } : {}))
      expect(response.status).toBe(200)
      const options = fetchMock.mock.calls[0]?.[1]
      expect(options).toMatchObject({
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-lifi-api-key': 'test-lifi-api-key',
        },
      })
      expect(JSON.parse(String(options?.body))).toEqual({
        fromChainId: ethereum,
        fromTokenAddress: USDC[ethereum].address,
        fromAddress: swapSender,
        toChainId: arbitrum,
        toTokenAddress: USDC[arbitrum].address,
        toAddress: swapRecipient,
        fromAmount: '100000000',
        options: {
          slippage: 0.005,
          order: order ?? 'CHEAPEST',
          integrator: 'sushi',
          exchanges: { allow: ['sushiswap'] },
          allowSwitchChain: false,
          allowDestinationCall: true,
          fee: 0.0002,
        },
      })
      expect(response.headers.get('Cache-Control')).toBe(
        's-maxage=15, stale-while-revalidate=20',
      )
    },
  )

  it('preserves the normal route response and distinct recipient', async () => {
    const route = {
      ...evmSwapStep.action,
      id: 'normal-swap',
      toAmount: evmSwapStep.estimate.toAmount,
      toAmountMin: evmSwapStep.estimate.toAmountMin,
      steps: [evmSwapStep],
      tags: ['CHEAPEST'],
      gasCostUSD: '0.10',
    }
    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ routes: [route] })),
    )

    const response = await GET(request())
    expect(response.status).toBe(200)
    const output = await response.json()
    expect(output.routes).toHaveLength(1)
    expect(output.routes[0]).toMatchObject({
      id: 'normal-swap',
      fromChainId: ethereum,
      toChainId: arbitrum,
      fromToken: route.fromToken,
      toToken: route.toToken,
      toAmount: route.toAmount,
      toAmountMin: route.toAmountMin,
      tags: ['CHEAPEST'],
      gasCostUSD: '0.10',
      step: evmSwapStep,
    })
    expect(output.routes[0]).not.toHaveProperty('steps')
    expect(output.routes[0].step.action.toAddress).toBe(swapRecipient)
  })

  it.each(['source', 'destination'] as const)(
    'normalizes the Solana %s on both sides of the API',
    async (direction) => {
      const lifiStep = createSolanaSwapStep(direction, 'lifi')
      const sushiStep = createSolanaSwapStep(direction, 'sushi')
      const route = {
        ...lifiStep.action,
        id: 'solana-swap',
        toAmount: lifiStep.estimate.toAmount,
        toAmountMin: lifiStep.estimate.toAmountMin,
        steps: [lifiStep],
      }
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ routes: [route] }))
      vi.stubGlobal('fetch', fetchMock)
      const response = await GET(
        request({
          fromChainId: String(sushiStep.action.fromChainId),
          toChainId: String(sushiStep.action.toChainId),
          fromTokenAddress: sushiStep.action.fromToken.address,
          toTokenAddress: sushiStep.action.toToken.address,
          fromAddress: sushiStep.action.fromAddress ?? swapSender,
          toAddress: sushiStep.action.toAddress ?? swapRecipient,
        }),
      )
      expect(response.status).toBe(200)
      const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))
      expect(body[direction === 'source' ? 'fromChainId' : 'toChainId']).toBe(
        LIFI_SOLANA_CHAIN_ID,
      )
      const output = await response.json()
      expect(output.routes).toHaveLength(1)
      expect(output.routes[0].step.action).toEqual(sushiStep.action)
      expect(
        output.routes[0][direction === 'source' ? 'fromChainId' : 'toChainId'],
      ).toBe(SvmChainId.SOLANA)
    },
  )
})
