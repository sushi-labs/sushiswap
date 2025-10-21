import { describe, expect, test } from 'vitest'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { getCurrencyPrice } from './get-currency-price'

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

  // Helper to create mock pool
  const createMockPool = (
    token0: Token,
    token1: Token,
    reserve0: number,
    reserve1: number,
  ): PoolInfo => ({
    name: `${token0.code}/${token1.code}`,
    address: 'POOL_ADDRESS',
    token0,
    token1,
    reserves: {
      token0: {
        code: token0.code,
        amount: String(reserve0 * 10 ** token0.decimals),
        formatted: String(reserve0),
      },
      token1: {
        code: token1.code,
        amount: String(reserve1 * 10 ** token1.decimals),
        formatted: String(reserve1),
      },
    },
    liquidity: {
      amount: String((reserve0 + reserve1) * 10 ** 7),
      formatted: String(reserve0 + reserve1),
    },
    fee: 3000,
    tickSpacing: 60,
    tvl: '0',
  })

  test('returns 1 for stablecoin itself', () => {
    const price = getCurrencyPrice(USDC, USDC, XLM, null, null, [])
    expect(price).toBe(1)
  })

  test('returns undefined when no pools exist', () => {
    const price = getCurrencyPrice(TOKEN, USDC, XLM, null, null, [])
    expect(price).toBeUndefined()
  })

  test('calculates price through multi-hop route (token -> XLM -> USDC)', () => {
    // TOKEN/XLM pool: 200 TOKEN, 100 XLM
    // Expected: 1 TOKEN = 100/200 = 0.5 XLM
    const tokenXlmPool = createMockPool(TOKEN, XLM, 200, 100)

    // XLM/USDC pool: 100 XLM, 10 USDC
    // Expected: 1 XLM = 10/100 = 0.1 USDC
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    // Expected: 1 TOKEN = 0.5 XLM × 0.1 USDC/XLM = 0.05 USDC
    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      tokenXlmPool,
      xlmUsdcPool,
      [],
    )

    expect(price).toBe(0.05)
  })

  test('calculates native token price directly', () => {
    // XLM/USDC pool: 100 XLM, 10 USDC
    // Expected: 1 XLM = 0.1 USDC
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    const price = getCurrencyPrice(XLM, USDC, XLM, null, xlmUsdcPool, [
      xlmUsdcPool,
    ])

    expect(price).toBe(0.1)
  })

  test('prefers direct stable pool over multi-hop when liquidity is higher', () => {
    // Direct TOKEN/USDC pool: 2000 TOKEN, 500 USDC (high liquidity)
    // Expected: 1 TOKEN = 500/2000 = 0.25 USDC
    const directPool = createMockPool(TOKEN, USDC, 2000, 500)

    // Multi-hop pools (lower liquidity)
    const tokenXlmPool = createMockPool(TOKEN, XLM, 200, 100)
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      tokenXlmPool,
      xlmUsdcPool,
      [directPool],
    )

    // Should use direct pool (0.25) instead of multi-hop (0.05)
    expect(price).toBe(0.25)
  })

  test('uses multi-hop when direct pool has lower liquidity', () => {
    // Direct TOKEN/USDC pool: 2 TOKEN, 0.5 USDC (low liquidity)
    const directPool = createMockPool(TOKEN, USDC, 2, 0.5)

    // Multi-hop pools (higher liquidity)
    const tokenXlmPool = createMockPool(TOKEN, XLM, 200, 100)
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      tokenXlmPool,
      xlmUsdcPool,
      [directPool],
    )

    // Should use multi-hop route (higher liquidity)
    expect(price).toBe(0.05)
  })

  test('handles different pool token orderings', () => {
    // Pool with reversed token order: XLM/TOKEN instead of TOKEN/XLM
    const xlmTokenPool = createMockPool(XLM, TOKEN, 100, 200)
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      xlmTokenPool,
      xlmUsdcPool,
      [],
    )

    // Should still calculate correctly: 1 TOKEN = 0.5 XLM × 0.1 USDC/XLM = 0.05 USDC
    expect(price).toBe(0.05)
  })

  test('returns undefined when pool has zero reserves', () => {
    const emptyPool = createMockPool(TOKEN, XLM, 0, 0)
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    const price = getCurrencyPrice(TOKEN, USDC, XLM, emptyPool, xlmUsdcPool, [])

    expect(price).toBeUndefined()
  })

  test('real-world example: expensive token', () => {
    // TOKEN/XLM pool: 10 TOKEN, 1000 XLM
    // Expected: 1 TOKEN = 1000/10 = 100 XLM
    const tokenXlmPool = createMockPool(TOKEN, XLM, 10, 1000)

    // XLM/USDC pool: 100 XLM, 10 USDC
    // Expected: 1 XLM = 0.1 USDC
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    // Expected: 1 TOKEN = 100 XLM × 0.1 USDC/XLM = 10 USDC
    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      tokenXlmPool,
      xlmUsdcPool,
      [],
    )

    expect(price).toBe(10)
  })

  test('real-world example: cheap token', () => {
    // TOKEN/XLM pool: 10000 TOKEN, 10 XLM
    // Expected: 1 TOKEN = 10/10000 = 0.001 XLM
    const tokenXlmPool = createMockPool(TOKEN, XLM, 10000, 10)

    // XLM/USDC pool: 100 XLM, 10 USDC
    // Expected: 1 XLM = 0.1 USDC
    const xlmUsdcPool = createMockPool(XLM, USDC, 100, 10)

    // Expected: 1 TOKEN = 0.001 XLM × 0.1 USDC/XLM = 0.0001 USDC
    const price = getCurrencyPrice(
      TOKEN,
      USDC,
      XLM,
      tokenXlmPool,
      xlmUsdcPool,
      [],
    )

    expect(price).toBe(0.0001)
  })
})
