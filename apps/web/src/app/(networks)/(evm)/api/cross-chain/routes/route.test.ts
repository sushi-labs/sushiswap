import { NextRequest } from 'next/server'
import { getNativeAddress } from 'sushi'
import { EvmChainId, SUSHI, USDC } from 'sushi/evm'
import { SvmChainId, WSOL } from 'sushi/svm'
import { getAddress } from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
