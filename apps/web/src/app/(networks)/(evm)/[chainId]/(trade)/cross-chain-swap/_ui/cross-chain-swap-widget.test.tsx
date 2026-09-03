/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { getLayerZeroTokenAddress } from 'src/lib/swap/layerzero/config'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CrossChainSwapWidget } from './cross-chain-swap-widget'
import { XSwapMaintenanceMessage } from './xswap-maintenance-message'

const {
  useForm,
  searchParams,
  lifiMaintenance,
  nearMaintenance,
  layerZeroMaintenance,
} = vi.hoisted(() => ({
  useForm: vi.fn(),
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
vi.mock('./xswap-form-provider', () => ({ useXSwapForm: useForm }))
vi.mock('@sushiswap/ui', () => ({
  Message: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))
vi.mock('./layerzero/cross-chain-swap-widget', () => ({
  LayerZeroCrossChainSwapWidget: () => <div>LayerZero</div>,
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

  function setForm(
    chainId0: number,
    chainId1: number,
    token0Param?: string,
    token1Param?: string,
  ) {
    useForm.mockReturnValue({ chainId0, chainId1, token0Param, token1Param })
    const params = new URLSearchParams({ chainId1: String(chainId1) })
    if (token0Param) params.set('token0', token0Param)
    if (token1Param) params.set('token1', token1Param)
    searchParams.mockReturnValue(params)
  }

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

  it('uses the same source chain as the quote providers after a native-history network change', () => {
    setForm(
      42161,
      -4,
      getLayerZeroTokenAddress(42161),
      getLayerZeroTokenAddress(-4),
    )
    act(() => root.render(<CrossChainSwapWidget />))
    expect(container.textContent).toBe('LayerZero')
  })

  it('uses the Stellar source from the form instead of a stale route parameter', () => {
    setForm(-4, 1, getLayerZeroTokenAddress(-4), getLayerZeroTokenAddress(1))
    act(() => root.render(<CrossChainSwapWidget />))
    expect(container.textContent).toBe('LayerZero')
  })

  it('selects the maintenance flag for the active form provider', () => {
    setForm(
      42161,
      -4,
      getLayerZeroTokenAddress(42161),
      getLayerZeroTokenAddress(-4),
    )
    layerZeroMaintenance.mockReturnValue({ data: true })
    act(() => root.render(<XSwapMaintenanceMessage />))
    expect(container.textContent).toContain('undergoing maintenance')
    layerZeroMaintenance.mockReturnValue({ data: false })
    nearMaintenance.mockReturnValue({ data: true })
    act(() => root.render(<XSwapMaintenanceMessage />))
    expect(container.textContent).toBe('')
  })

  it('keeps other Stellar tokens on NEAR Intents and EVM-only swaps on LiFi', () => {
    setForm(-4, 1, 'NATIVE')
    act(() => root.render(<CrossChainSwapWidget />))
    expect(container.textContent).toBe('NEAR Intents')
    setForm(42161, 1)
    act(() => root.render(<CrossChainSwapWidget />))
    expect(container.textContent).toBe('LiFi')
  })
})
