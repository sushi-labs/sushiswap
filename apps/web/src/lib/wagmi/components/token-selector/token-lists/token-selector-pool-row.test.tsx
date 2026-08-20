/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId, EvmToken } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/ui', () => ({
  Currency: {
    Icon: () => null,
    IconList: ({ children }: PropsWithChildren) => children,
  },
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))

vi.mock('../token-selector-theme', () => ({
  useTokenSelectorTheme: () => 'default',
}))

import { TokenSelectorPoolRow } from './token-selector-pool-row'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const token0 = new EvmToken({
  address: '0x0000000000000000000000000000000000000002',
  chainId: EvmChainId.ETHEREUM,
  decimals: 18,
  name: 'Token Zero',
  symbol: 'TK0',
})
const token1 = new EvmToken({
  address: '0x0000000000000000000000000000000000000003',
  chainId: EvmChainId.ETHEREUM,
  decimals: 6,
  name: 'Token One',
  symbol: 'TK1',
})

describe('TokenSelectorPoolRow', () => {
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

  it('selects token0 and token1 together', () => {
    const onSelect = vi.fn()

    act(() => {
      root.render(
        <TokenSelectorPoolRow
          pool={{
            address: '0x0000000000000000000000000000000000000001',
            token0,
            token1,
            version: 'v3',
          }}
          onSelect={onSelect}
        />,
      )
    })

    expect(container.textContent).toContain('TK0/TK1')
    expect(container.textContent).toContain('v3')

    container.querySelector('button')?.click()
    expect(onSelect).toHaveBeenCalledWith(token0, token1)
  })
})
