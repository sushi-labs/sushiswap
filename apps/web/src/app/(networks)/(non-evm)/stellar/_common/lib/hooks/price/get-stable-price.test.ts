import { beforeAll, describe, expect, test, vi } from 'vitest'

// Mock dependencies
const getQuoteExactInputMock = vi.fn()
const getQuoteExactInputSingleMock = vi.fn()
vi.mock('~stellar/_common/lib/services/quote-service', () => {
  class MockQuoteService {
    getQuoteExactInputSingle = getQuoteExactInputSingleMock
    getQuoteExactInput = getQuoteExactInputMock
  }
  return { QuoteService: MockQuoteService }
})
vi.mock('~stellar/_common/lib/soroban', () => {
  return {
    getStableTokens: vi.fn(),
  }
})
vi.mock('~stellar/_common/lib/soroban/dex-router-helpers', () => {
  return { findBestPath: vi.fn() }
})

// Import mocked dependencies
import { getStableTokens } from '~stellar/_common/lib/soroban'
import {
  type Route,
  findBestPath,
} from '~stellar/_common/lib/soroban/dex-router-helpers'

// --- Typed helpers ---
const mockedGetStableTokens = vi.mocked(getStableTokens)
const mockedFindBestPath = vi.mocked(findBestPath)

import type { Token } from '~stellar/_common/lib/types/token.type'
import { getStablePrice } from './get-stable-price'

describe('getCurrencyPrice', () => {
  // Mock tokens
  const USDC: Token = {
    name: 'USDC',
    code: 'USDC',
    decimals: 7,
    contract: 'USDC_CONTRACT',
    issuer: 'USDC_ISSUER',
    org: 'Centre',
    domain: 'centre.io',
    isStable: true,
  }

  const XLM: Token = {
    name: 'Stellar Lumens',
    code: 'XLM',
    decimals: 7,
    contract: 'XLM_CONTRACT',
    issuer: 'native',
    org: 'Stellar',
    domain: 'stellar.org',
  }

  const TOKEN: Token = {
    name: 'Test Token',
    code: 'TOKEN',
    decimals: 7,
    contract: 'TOKEN_CONTRACT',
    issuer: '',
    org: 'Test',
    domain: '',
  }

  test("returns '0' for undefined token", async () => {
    mockedGetStableTokens.mockReturnValue([USDC])
    const price = await getStablePrice(undefined)
    expect(price).toBe('0')
  })

  test("returns '1' for stablecoin itself", async () => {
    mockedGetStableTokens.mockReturnValue([USDC])
    const price = await getStablePrice(USDC)
    expect(price).toBe('1')
  })

  test("returns '0' when no pools exist", async () => {
    mockedGetStableTokens.mockReturnValue([USDC])
    mockedFindBestPath.mockResolvedValueOnce(null)
    const price = await getStablePrice(TOKEN)
    expect(price).toBe('0')
  })

  test('calculates price through multi-hop route (token -> XLM -> USDC)', async () => {
    const expectedPrice = 0.05
    const fees: [number, number] = [3000, 3000]
    const feeMultiplier = fees.reduce(
      (acc, fee) => acc * (1 - fee / 1_000_000),
      1,
    )
    mockedGetStableTokens.mockReturnValue([USDC])
    const bestRoute: Route = {
      type: 'multihop',
      path: [TOKEN, XLM, USDC],
      fees,
      pools: [
        {
          address: 'TOKEN_XLM_POOL_ADDRESS',
          tokenA: TOKEN,
          tokenB: XLM,
          fee: fees[0],
        },
        {
          address: 'XLM_USDC_POOL_ADDRESS',
          tokenA: XLM,
          tokenB: USDC,
          fee: fees[1],
        },
      ],
    }
    mockedFindBestPath.mockResolvedValueOnce(bestRoute)

    getQuoteExactInputMock.mockResolvedValueOnce({
      amountOut: BigInt(
        Math.floor(expectedPrice * 10 ** USDC.decimals * feeMultiplier),
      ),
      path: bestRoute.path.map((t) => t.contract),
      fees: bestRoute.fees,
      priceImpact: 0,
      routeType: 'multihop',
    })

    const actualPrice = await getStablePrice(TOKEN)
    expect(Number(actualPrice)).toBeCloseTo(expectedPrice, 6)
  })

  test('calculates native token price directly', async () => {
    const expectedPrice = 0.1
    const fee = 3000
    const feeMultiplier = 1 - fee / 1_000_000

    mockedGetStableTokens.mockReturnValue([USDC])
    const bestRoute: Route = {
      type: 'direct',
      path: [XLM, USDC],
      fees: [fee],
      pools: [
        {
          address: 'XLM_USDC_POOL_ADDRESS',
          tokenA: XLM,
          tokenB: USDC,
          fee: fee,
        },
      ],
    }
    mockedFindBestPath.mockResolvedValueOnce(bestRoute)

    getQuoteExactInputSingleMock.mockResolvedValueOnce({
      amountOut: BigInt(
        Math.floor(expectedPrice * 10 ** USDC.decimals * feeMultiplier),
      ),
      path: bestRoute.path.map((t) => t.contract),
      fees: bestRoute.fees,
      priceImpact: 0,
      routeType: 'multihop',
    })

    const actualPrice = await getStablePrice(TOKEN)
    expect(Number(actualPrice)).toBeCloseTo(expectedPrice, 6)
  })
})
