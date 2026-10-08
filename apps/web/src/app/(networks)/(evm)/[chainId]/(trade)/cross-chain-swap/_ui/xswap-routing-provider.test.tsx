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
  token0Param: 'NATIVE',
  token1Param: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
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
    [1, 42161, 999, 4663].includes(chainId),
}))
vi.mock('./xswap-form-provider', () => ({
  useXSwapForm: () => ({
    chainId0: fixture.chainId0,
    chainId1: fixture.chainId1,
    token0Param: fixture.token0Param,
    token1Param: fixture.token1Param,
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

const hypeDeployments = [
  { chainId: 999, tokenParam: 'NATIVE' },
  {
    chainId: 4663,
    tokenParam: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
  },
  {
    chainId: 42161,
    tokenParam: '0x0e867974275Cd31C25015C2753C9d75F9f355379',
  },
] as const
const hypePairs = hypeDeployments.flatMap((source) =>
  hypeDeployments
    .filter((destination) => source.chainId !== destination.chainId)
    .map((destination) => ({
      chainId0: source.chainId,
      token0Param: source.tokenParam,
      chainId1: destination.chainId,
      token1Param: destination.tokenParam,
    })),
)

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
      token0Param: 'NATIVE',
      token1Param: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
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

  it.each(hypePairs)(
    'selects VT immediately for HYPE $chainId0 → $chainId1 without upstream quotes',
    (pair) => {
      Object.assign(fixture, pair)
      for (const availability of ['available', 'loading', 'error'] as const) {
        fixture.lifiSuccess = availability === 'available'
        fixture.lifiError = availability === 'error'
        fixture.lifiRoutes = availability === 'available' ? [{}] : []
        fixture.nearAvailability = availability
        render()

        expect(container.textContent).toBe('layerzero')
        expect(fixture.valueTransferEnabled).toBe(true)
        expect(fixture.lifiEnabled).toBe(false)
        expect(fixture.nearEnabled).toBe(false)
      }
    },
  )

  it('keeps the HYPE provider selected before an amount is entered', () => {
    Object.assign(fixture, hypePairs[0], {
      positiveAmount: false,
      tokensLoading: true,
      lifiSuccess: false,
    })
    render()

    expect(container.textContent).toBe('layerzero')
    expect(fixture.lifiEnabled).toBe(false)
    expect(fixture.nearEnabled).toBe(false)
    expect(fixture.valueTransferEnabled).toBe(true)
  })

  it('restores normal provider priority when a HYPE pair changes to unrelated tokens', () => {
    Object.assign(fixture, hypePairs[0])
    fixture.lifiRoutes = [{}]
    render()
    expect(container.textContent).toBe('layerzero')

    fixture.token1Param = '0x1111111111111111111111111111111111111111'
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.lifiEnabled).toBe(true)
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

  it('preserves the VT review and confirmation lock until the dialog closes', () => {
    Object.assign(fixture, hypePairs[0])
    fixture.lifiRoutes = [{}]
    render()
    fixture.reviewOpen = true
    render()
    expect(container.textContent).toBe('layerzero')

    fixture.token1Param = '0x1111111111111111111111111111111111111111'
    render()
    expect(container.textContent).toBe('layerzero')
    expect(fixture.valueTransferEnabled).toBe(true)

    fixture.positiveAmount = false
    fixture.reviewOpen = false
    fixture.confirmOpen = true
    render()
    expect(container.textContent).toBe('layerzero')
    expect(fixture.valueTransferEnabled).toBe(true)

    fixture.confirmOpen = false
    render()
    expect(container.textContent).toBe('lifi')
    expect(fixture.valueTransferEnabled).toBe(false)
  })
})
