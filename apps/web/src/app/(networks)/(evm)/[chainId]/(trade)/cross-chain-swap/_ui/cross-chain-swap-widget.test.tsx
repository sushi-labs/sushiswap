/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CrossChainSwapWidget } from './cross-chain-swap-widget'
import { XSwapMaintenanceMessage } from './xswap-maintenance-message'

const {
  useRouting,
  searchParams,
  lifiMaintenance,
  nearMaintenance,
  layerZeroMaintenance,
} = vi.hoisted(() => ({
  useRouting: vi.fn(),
  searchParams: vi.fn(),
  lifiMaintenance: vi.fn(),
  nearMaintenance: vi.fn(),
  layerZeroMaintenance: vi.fn(),
}))
vi.mock('next/navigation', () => ({
  // Native history updates change the form without a server route navigation.
  useParams: () => ({ chainId: '1' }),
  useSearchParams: searchParams,
}))
vi.mock('./xswap-routing-context', () => ({ useXSwapRouting: useRouting }))
vi.mock('@sushiswap/ui', () => ({
  Message: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))
vi.mock('./layerzero/cross-chain-swap-widget', () => ({
  LayerZeroCrossChainSwapWidget: () => <div>LayerZero</div>,
}))
vi.mock('./layerzero/trade-review-dialog', () => ({
  LayerZeroTradeReviewDialog: ({ children }: PropsWithChildren) => children,
}))
vi.mock('./near-intents/cross-chain-swap-widget', () => ({
  NearIntentsCrossChainSwapWidget: () => <div>NEAR Intents</div>,
}))
vi.mock('./lifi/token-not-found-dialog', () => ({
  CrossChainSwapTokenNotFoundDialog: () => null,
}))
vi.mock('./lifi/token0-input', () => ({
  CrossChainSwapToken0Input: () => null,
}))
vi.mock('./lifi/token1-input', () => ({
  CrossChainSwapToken1Input: () => null,
}))
vi.mock('./lifi/trade-stats', () => ({ CrossChainSwapTradeStats: () => null }))
vi.mock('./lifi/trade-button', () => ({
  CrossChainSwapTradeButton: () => <div>LiFi</div>,
}))
vi.mock('./xswap-switch-tokens-button', () => ({
  XSwapSwitchTokensButton: () => null,
}))
vi.mock('./xswap-widget-frame', () => ({
  XSwapWidgetFrame: ({ children }: PropsWithChildren) => children,
}))
vi.mock('./layerzero/hooks/use-is-layerzero-xswap-maintenance', () => ({
  useIsLayerZeroXSwapMaintenance: layerZeroMaintenance,
}))
vi.mock('./lifi/use-is-maintenance', () => ({
  useIsCrossChainSwapMaintenance: lifiMaintenance,
}))
vi.mock('./near-intents/hooks/use-is-near-intents-xswap-maintenance', () => ({
  useIsNearIntentsXSwapMaintenance: nearMaintenance,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('cross-chain widget provider consistency', () => {
  let root: Root
  let container: HTMLDivElement

  beforeEach(() => {
    vi.resetAllMocks()
    lifiMaintenance.mockReturnValue({ data: false })
    nearMaintenance.mockReturnValue({ data: false })
    layerZeroMaintenance.mockReturnValue({ data: false })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('renders the selected provider without adding a provider selector', () => {
    for (const [mode, text] of [
      ['lifi', 'LiFi'],
      ['near-intents', 'NEAR Intents'],
      ['layerzero', 'LayerZero'],
    ]) {
      useRouting.mockReturnValue(mode)
      act(() => root.render(<CrossChainSwapWidget />))
      expect(container.textContent).toBe(text)
    }
  })

  it('uses the maintenance flag of the selected fallback provider', () => {
    useRouting.mockReturnValue('layerzero')
    nearMaintenance.mockReturnValue({ data: true })
    act(() => root.render(<XSwapMaintenanceMessage />))
    expect(container.textContent).toBe('')
    layerZeroMaintenance.mockReturnValue({ data: true })
    act(() => root.render(<XSwapMaintenanceMessage />))
    expect(container.textContent).toContain('undergoing maintenance')
    useRouting.mockReturnValue('lifi')
    act(() => root.render(<XSwapMaintenanceMessage />))
    expect(container.textContent).toBe('')
  })
})
