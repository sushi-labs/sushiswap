import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ReviewAmountValue } from './review-amount-value'

vi.mock('@sushiswap/ui', () => ({
  SkeletonText: () => <span>Loading USD</span>,
}))

describe('ReviewAmountValue', () => {
  it.each([0, '0', '0.00'])(
    'displays a known zero USD value (%j)',
    (usdValue) => {
      const html = renderToStaticMarkup(
        <ReviewAmountValue usdValue={usdValue}>0 ETH</ReviewAmountValue>,
      )

      expect(html).toContain('0 ETH')
      expect(html).toContain('$0.00')
    },
  )

  it.each([12.34, '12.34'])(
    'formats a known finite USD value (%j)',
    (usdValue) => {
      const html = renderToStaticMarkup(
        <ReviewAmountValue usdValue={usdValue}>2 TOKEN</ReviewAmountValue>,
      )

      expect(html).toContain('2 TOKEN')
      expect(html).toContain('$12.34')
    },
  )

  it.each([
    undefined,
    null,
    '',
    '   ',
    'unknown',
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    'Infinity',
    -1,
    '-1',
  ])('does not invent a zero dollar value for %j', (usdValue) => {
    const html = renderToStaticMarkup(
      <ReviewAmountValue usdValue={usdValue}>2 TOKEN</ReviewAmountValue>,
    )

    expect(html).toContain('2 TOKEN')
    expect(html).not.toContain('$')
    expect(html).not.toContain('Loading USD')
  })

  it.each([undefined, 0, 12.34])(
    'keeps the token amount visible while USD is loading (%j)',
    (usdValue) => {
      const html = renderToStaticMarkup(
        <ReviewAmountValue usdValue={usdValue} isUsdLoading>
          2 TOKEN
        </ReviewAmountValue>,
      )

      expect(html).toContain('2 TOKEN')
      expect(html).toContain('Loading USD')
      expect(html).not.toContain('$')
    },
  )
})
