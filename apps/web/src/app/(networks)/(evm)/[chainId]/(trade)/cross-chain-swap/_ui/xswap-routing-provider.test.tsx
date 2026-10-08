/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { RouteAvailability } from 'src/lib/swap/cross-chain/route-availability'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useXSwapRouting, useXSwapRoutingLock } from './xswap-routing-context'
import { XSwapRoutingProvider } from './xswap-routing-provider'

const fixture = vi.hoisted(() => ({
  chainId0: 1,
  chainId1: 42161,
  positiveAmount: true,
  tokensLoading: false,
  lifiSuccess: true,
  lifiError: false,
  lifiRoutes: [] as object[],
  nearAvailability: 'available' as RouteAvailability,
  nearEnabled: false,
  valueTransferEnabled: false,
  lifiEnabled: false,
  reviewOpen: false,
  confirmOpen: false,
}))

vi.mock('src/config', () => ({
  isLifiXSwapSupportedChainId: (chainId: number) =>
    chainId === 1 || chainId === 42161,
}))
vi.mock('./xswap-form-provider', () => ({
  useXSwapForm: () => ({
    chainId0: fixture.chainId0,
    chainId1: fixture.chainId1,
  }),
}))
vi.mock('./lifi/xswap-provider', () => ({
  useLifiXSwap: () => ({
    state: {
      swapAmount: { gt: () => fixture.positiveAmount },
      token0: {},
      token1: {},
    },
    isLoading: fixture.tokensLoading,
  }),
  useLifiXSwapTradeRoutes: ({ enabled }: { enabled: boolean }) => {
    fixture.lifiEnabled = enabled
    return {
      isSuccess: fixture.lifiSuccess,
      isError: fixture.lifiError,
      data: fixture.lifiRoutes,
    }
  },
}))
vi.mock('./near-intents/xswap-provider', () => ({
  NearIntentsXSwapProvider: ({
    children,
    enabled,
  }: { children: ReactNode; enabled: boolean }) => {
    fixture.nearEnabled = enabled
    return children
  },
  useNearIntentsXSwap: () => ({ routeAvailability: fixture.nearAvailability }),
}))
vi.mock('./layerzero/xswap-provider', () => ({
  LayerZeroXSwapProvider: ({
    children,
    enabled,
  }: { children: ReactNode; enabled: boolean }) => {
    fixture.valueTransferEnabled = enabled
    return children
  },
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function ProviderDialog({
  provider,
}: { provider: ReturnType<typeof useXSwapRouting> }): ReactNode {
  useXSwapRoutingLock(provider, fixture.reviewOpen || fixture.confirmOpen)
  return <span>{provider}</span>
}

function ActiveWidget(): ReactNode {
  const provider = useXSwapRouting()
  return <ProviderDialog key={provider} provider={provider} />
}

describe('cross-chain routing provider', () => {
  let root: Root
  let container: HTMLDivElement

  function render(): void {
    act(() =>
      root.render(
        <XSwapRoutingProvider>
          <ActiveWidget />
        </XSwapRoutingProvider>,
      ),
    )
  }

  beforeEach(() => {
    Object.assign(fixture, {
      chainId0: 1,
      chainId1: 42161,
      positiveAmount: true,
      tokensLoading: false,
      lifiSuccess: true,
      lifiError: false,
      lifiRoutes: [],
      nearAvailability: 'available',
      nearEnabled: false,
      valueTransferEnabled: false,
      lifiEnabled: false,
      reviewOpen: false,
      confirmOpen: false,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('gates each provider in LI.FI, NEAR, Value Transfer order', () => {
    fixture.lifiRoutes = [{}]
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.nearEnabled).toBe(false)
    expect(fixture.valueTransferEnabled).toBe(false)

    fixture.lifiRoutes = []
    render()
    expect(container.textContent).toBe('near-intents')
    expect(fixture.nearEnabled).toBe(true)
    expect(fixture.valueTransferEnabled).toBe(false)

    fixture.nearAvailability = 'empty'
    render()
    expect(container.textContent).toBe('layerzero')
    expect(fixture.valueTransferEnabled).toBe(true)
  })

  it('does not fall through while LI.FI is loading or failing', () => {
    fixture.lifiSuccess = false
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.nearEnabled).toBe(false)
    fixture.lifiError = true
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.nearEnabled).toBe(false)
    expect(fixture.valueTransferEnabled).toBe(false)
  })

  it('skips LI.FI for a Stellar source without querying a substituted EVM pair', () => {
    fixture.chainId0 = -4
    render()
    expect(fixture.lifiEnabled).toBe(false)
    expect(fixture.nearEnabled).toBe(true)
    expect(container.textContent).toBe('near-intents')
  })

  it('keeps NEAR mounted through amount clearing and review-to-confirm handoff, then releases', () => {
    render()
    fixture.reviewOpen = true
    render()
    expect(container.textContent).toBe('near-intents')

    // Source submission clears the form and opens confirmation in one update.
    fixture.positiveAmount = false
    fixture.reviewOpen = false
    fixture.confirmOpen = true
    render()
    expect(container.textContent).toBe('near-intents')
    expect(fixture.valueTransferEnabled).toBe(false)

    fixture.confirmOpen = false
    render()
    expect(container.textContent).toBe('lifi')
  })

  it('pins LI.FI while reviewing despite refreshed route availability', () => {
    fixture.lifiRoutes = [{}]
    fixture.reviewOpen = true
    render()
    fixture.lifiRoutes = []
    fixture.nearAvailability = 'empty'
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.valueTransferEnabled).toBe(false)
    fixture.reviewOpen = false
    render()
    expect(container.textContent).toBe('layerzero')
  })
})
