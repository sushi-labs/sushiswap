/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Percent } from 'sushi'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/ui', () => ({
  SkeletonText: () => null,
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))

import { PricePanel } from './price-panel'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const currency = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  symbol: 'TKN',
  name: 'Token',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
})

describe('PricePanel', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function renderPrice(price: number | undefined, value = '3') {
    act(() => {
      root.render(
        <PricePanel
          loading={false}
          currency={currency}
          value={value}
          price={price}
          priceImpact={new Percent({ numerator: 1, denominator: 100 })}
        />,
      )
    })
  }

  it.each([undefined, 0])(
    'renders an accessible unavailable estimate for price %s',
    (price) => {
      renderPrice(price)

      expect(container.textContent).toBe('$ —')
      expect(
        container.querySelector('[aria-label="USD estimate unavailable"]'),
      ).not.toBeNull()
      expect(container.textContent).not.toContain('%')
    },
  )

  it('renders a known estimate and price impact', () => {
    renderPrice(2)

    expect(container.textContent).toContain('$ 6.00')
    expect(container.textContent).toContain('-1%')
  })

  it('keeps zero as the amount estimate when a price is available', () => {
    renderPrice(2, '')

    expect(container.textContent).toContain('$ 0.00')
  })
})
