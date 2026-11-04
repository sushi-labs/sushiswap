/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId, USDC, WETH9 } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { PriceBlock } from './price-block'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('preserves the default unit label and supports an optional USD label', () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  try {
    for (const populated of [false, true]) {
      act(() =>
        root.render(
          <PriceBlock
            label="Min Price"
            value="1"
            token0={populated ? WETH9[EvmChainId.ETHEREUM] : undefined}
            token1={populated ? USDC[EvmChainId.ETHEREUM] : undefined}
            increment={() => '2'}
            decrement={() => '0.5'}
            onUserInput={vi.fn()}
          />,
        ),
      )
      expect(container.textContent).toContain(
        populated ? 'USDC per WETH' : ' per ',
      )
      expect(container.textContent).not.toContain('undefined')
    }
    const onUserInput = vi.fn()
    act(() =>
      root.render(
        <PriceBlock
          label="Min Price"
          unit="USD per WETH"
          value="1"
          token0={WETH9[EvmChainId.ETHEREUM]}
          token1={USDC[EvmChainId.ETHEREUM]}
          increment={() => '2'}
          decrement={() => '0.5'}
          onUserInput={onUserInput}
        />,
      ),
    )
    expect(container.textContent).toContain('USD per WETH')
    act(() =>
      container
        .querySelector<HTMLButtonElement>('[aria-label="Increase min price"]')
        ?.click(),
    )
    expect(onUserInput).toHaveBeenCalledWith('2')
  } finally {
    act(() => root.unmount())
  }
})
