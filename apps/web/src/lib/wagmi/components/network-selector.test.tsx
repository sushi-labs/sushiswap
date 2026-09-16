/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { NetworkSelector } from './network-selector'

vi.mock('next/navigation', () => ({
  usePathname: () => '/robinhood/launchpad',
  useRouter: () => ({ push: vi.fn() }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('opens without locking page scroll or adding scrollbar compensation', async () => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  try {
    await act(async () => {
      root.render(
        <NetworkSelector
          networks={[EvmChainId.ROBINHOOD, EvmChainId.ARC]}
          selected={EvmChainId.ROBINHOOD}
          onSelect={vi.fn()}
        >
          <button type="button">Network</button>
        </NetworkSelector>,
      )
    })
    await act(async () => container.querySelector('button')?.click())
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.hasAttribute('data-scroll-locked')).toBe(false)
    expect(document.body.style.pointerEvents).not.toBe('none')
    await act(async () => {
      document.activeElement?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      )
    })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(container.querySelector('button'))
    })
  } finally {
    await act(async () => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
