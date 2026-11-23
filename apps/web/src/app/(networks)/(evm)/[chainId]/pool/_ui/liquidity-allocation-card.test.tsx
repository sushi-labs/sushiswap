import { renderToStaticMarkup } from 'react-dom/server'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { describe, expect, it, vi } from 'vitest'
import { LiquidityAllocationCard } from './liquidity-allocation-card'

const { useAmountUsd } = vi.hoisted(() => ({ useAmountUsd: vi.fn() }))
vi.mock('src/lib/hooks/use-amount-usd', () => ({ useAmountUsd }))
vi.mock('src/lib/hooks/use-currency-icon-color', () => ({
  useCurrencyIconColor: () => undefined,
}))

const token = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  decimals: 18,
  symbol: 'SUSHI',
  name: 'Sushi',
})
const native = EvmNative.fromChainId(EvmChainId.ETHEREUM)

function renderAllocation(
  first: number | undefined,
  second: number | undefined,
  nativeAmount = 1n,
): string {
  useAmountUsd
    .mockReturnValueOnce({ data: first })
    .mockReturnValueOnce({ data: second })
  return renderToStaticMarkup(
    <LiquidityAllocationCard
      title="Position Value"
      amount0={new Amount(token, 126_275n * 10n ** 18n)}
      amount1={new Amount(native.wrap(), nativeAmount * 10n ** 18n)}
    />,
  )
}

describe('liquidity allocation', () => {
  it('uses USD weights for the bar and rows and keeps the headline unabbreviated', () => {
    const html = renderAllocation(29_250, 20_750)
    expect(html).toContain('$50,000.00')
    expect(html).toContain('$29.25k')
    expect(html).toContain('width:58.5%')
    expect(html).toContain('>41.5%<')
    expect(html).toContain('126,275 SUSHI')
    expect(html).toContain('1 ETH')
  })

  it('withholds the total and shares when a nonzero balance has no price', () => {
    const html = renderAllocation(250, undefined)
    expect(html).toContain('$250.00')
    expect(html).not.toContain('%')
    expect(html).not.toContain('$0.00')
  })

  it('gives the funded token the full bar when the other balance is zero and unpriced', () => {
    const html = renderAllocation(250, undefined, 0n)
    expect(html).toContain('width:100%')
    expect(html).toContain('>0%<')
    expect(html).toContain('$0.00')
  })
})
