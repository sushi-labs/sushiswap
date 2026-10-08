import { Amount, Fraction, Percent } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { warningSeverity } from '../warning-severity'
import { getCrossChainPriceImpact } from './price-impact'

const hype = EvmNative.fromChainId(EvmChainId.HYPEREVM)
const robinhoodHype = new EvmToken({
  chainId: EvmChainId.ROBINHOOD,
  address: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
  decimals: 18,
  symbol: 'HYPE',
  name: 'HYPE',
})
const usdc = new EvmToken({
  chainId: EvmChainId.ARBITRUM,
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
})
const oneDollar = new Fraction(1)
const hypePrice = new Fraction({ numerator: 8818, denominator: 100 })

function quote(amountIn: string, amountOut: string) {
  return {
    amountIn: Amount.fromHuman(hype, amountIn),
    amountOut: Amount.fromHuman(robinhoodHype, amountOut),
    tokenInPrice: hypePrice,
    tokenOutPrice: hypePrice,
  }
}

describe('cross-chain price impact', () => {
  it('reports the HYPE quote as a small loss without the severe warning', () => {
    const impact = getCrossChainPriceImpact(quote('0.11', '0.106210478'))

    expect(impact?.toPercentString()).toBe('3.45%')
    expect(warningSeverity(impact)).toBe(2)
  })

  it('normalizes different currency decimals before comparing USD values', () => {
    const impact = getCrossChainPriceImpact({
      amountIn: Amount.fromHuman(usdc, '100'),
      amountOut: Amount.fromHuman(robinhoodHype, '1'),
      tokenInPrice: oneDollar,
      tokenOutPrice: new Fraction(99),
    })

    expect(impact?.eq(new Percent({ numerator: 1, denominator: 100 }))).toBe(
      true,
    )
  })

  it('preserves a one-unit difference beyond floating-point integer precision', () => {
    const amount = 10n ** 30n
    const impact = getCrossChainPriceImpact({
      amountIn: new Amount(hype, amount),
      amountOut: new Amount(robinhoodHype, amount - 1n),
      tokenInPrice: hypePrice,
      tokenOutPrice: hypePrice,
    })

    expect(
      impact?.eq(new Percent({ numerator: 1n, denominator: amount })),
    ).toBe(true)
  })

  it('uses the input as the denominator for high losses', () => {
    const impact = getCrossChainPriceImpact(quote('1', '0.01'))

    expect(impact?.toPercentString()).toBe('99.00%')
    expect(warningSeverity(impact)).toBe(4)
  })

  it('reports a zero output as a total loss when both prices are known', () => {
    expect(getCrossChainPriceImpact(quote('1', '0'))?.toPercentString()).toBe(
      '100.00%',
    )
  })

  it('preserves favorable rates as negative impact', () => {
    const impact = getCrossChainPriceImpact(quote('1', '1.05'))

    expect(impact?.toPercentString()).toBe('-5.00%')
    expect(warningSeverity(impact)).toBe(0)
  })

  it('reports equal values as zero impact', () => {
    expect(getCrossChainPriceImpact(quote('1', '1'))?.toPercentString()).toBe(
      '0.00%',
    )
  })

  it('does not invent an impact while amounts or prices are missing', () => {
    for (const field of [
      'amountIn',
      'amountOut',
      'tokenInPrice',
      'tokenOutPrice',
    ] as const) {
      expect(
        getCrossChainPriceImpact({ ...quote('1', '1'), [field]: undefined }),
      ).toBeUndefined()
    }
  })

  it('rejects zero or negative inputs and negative outputs', () => {
    expect(getCrossChainPriceImpact(quote('0', '1'))).toBeUndefined()
    expect(getCrossChainPriceImpact(quote('-1', '1'))).toBeUndefined()
    expect(getCrossChainPriceImpact(quote('1', '-1'))).toBeUndefined()
  })

  it('does not report an impact for invalid or nonpositive token prices', () => {
    for (const price of [
      new Fraction(0),
      new Fraction({ numerator: -1 }),
      new Fraction({ numerator: 1, denominator: 0 }),
      new Fraction({ numerator: 1, denominator: -1 }),
    ]) {
      for (const field of ['tokenInPrice', 'tokenOutPrice'] as const) {
        expect(
          getCrossChainPriceImpact({ ...quote('1', '1'), [field]: price }),
        ).toBeUndefined()
      }
    }
  })
})
