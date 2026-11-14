import { Price } from 'sushi'
import { maxUint256 } from 'viem'
import { describe, expect, it } from 'vitest'
import { getLimitBuyAmount, getOrderPrice, getUsdMarketPrice } from './amounts'
import { token, token1 } from './test-fixtures'

describe('CoW limit amounts', () => {
  it('preserves the minimum price across differing decimals, inversion and dust rounding', () => {
    const price = Price.fromHuman(
      token(6),
      token(18, token1),
      '0.3333333333333333333333333333333333333333',
    )
    expect(getLimitBuyAmount(1000000n, price)).toBe(333333333333333334n)
    expect(
      getLimitBuyAmount(
        1n,
        Price.fromHuman(token(18), token(6, token1), '0.01'),
      ),
    ).toBe(1n)
    expect(
      getLimitBuyAmount(
        3n,
        Price.fromHuman(token(0, token1), token(0), '3').invert(),
      ),
    ).toBe(1n)
    const original = getOrderPrice(
      { sellAmount: '3', buyAmount: '1' },
      token(0),
      token(0, token1),
    )
    expect(getLimitBuyAmount(3n, original)).toBe(1n)
    expect(original.toSignificant(6)).toBe('0.333333')
    const tokenPrice = getOrderPrice(
      { sellAmount: '3000000', buyAmount: '1000000000000000000' },
      token(6),
      token(18, token1),
    )
    expect(getLimitBuyAmount(1000000n, tokenPrice)).toBe(333333333333333334n)
  })

  it('rejects a limit that would overflow the order', () => {
    expect(() =>
      getLimitBuyAmount(
        maxUint256,
        Price.fromHuman(token(0), token(18, token1), '2'),
      ),
    ).toThrow()
  })

  it('estimates a market price from USD prices across decimals', () => {
    const price = getUsdMarketPrice(token(18), token(6, token1), 3000, 1)
    if (!price) throw new Error('Expected a USD market price')
    expect(price.toSignificant()).toBe('3000')
    expect(getLimitBuyAmount(10n ** 18n, price)).toBe(3_000_000_000n)
    expect(getUsdMarketPrice(token(18), token(6, token1), 0, 1)).toBeUndefined()
    expect(
      getUsdMarketPrice(token(18), token(6, token1), 1, undefined),
    ).toBeUndefined()
  })
})
