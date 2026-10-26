/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { USDC } from 'sushi/evm'
import { STELLAR_USDT0, StellarChainId, StellarToken } from 'sushi/stellar'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GeoBlockedTokens } from '~stellar/_common/ui/checker/geo-blocked-tokens'
import { LayerZeroTradeButton } from './layerzero/trade-button'
import { NearIntentsCrossChainSwapTradeButton } from './near-intents/trade-button'

const { useXswap, useCountryCode, trustline, approval } = vi.hoisted(() => ({
  useXswap: vi.fn(),
  useCountryCode: vi.fn(),
  trustline: vi.fn(),
  approval: vi.fn(),
}))

vi.mock('./layerzero/xswap-provider', () => ({ useLayerZeroXSwap: useXswap }))
vi.mock('./near-intents/xswap-provider', () => ({
  useNearIntentsXSwap: useXswap,
}))
vi.mock('src/lib/hooks/use-country-code', () => ({ useCountryCode }))
vi.mock('./layerzero/hooks/use-is-layerzero-xswap-maintenance', () => ({
  useIsLayerZeroXSwapMaintenance: () => ({ data: false }),
}))
vi.mock('./near-intents/hooks/use-is-near-intents-xswap-maintenance', () => ({
  useIsNearIntentsXSwapMaintenance: () => ({ data: false }),
}))
vi.mock('./near-intents/trade-review-dialog', () => ({
  NearIntentsTradeReviewDialog: ({ children }: PropsWithChildren) => children,
}))
vi.mock('./layerzero/trade-approval', () => ({
  LayerZeroTradeApproval: ({ children }: PropsWithChildren) => {
    approval()
    return children
  },
}))
vi.mock('src/lib/wagmi/systems/checker/amounts', () => ({
  Amounts: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/guard', () => ({
  Guard: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/network', () => ({
  Network: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/stock-token-region', () => ({
  StockTokenRegion: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/success', () => ({
  Success: ({ children }: PropsWithChildren) => children,
}))
vi.mock('~stellar/_common/ui/checker', () => ({
  Checker: {
    GeoBlockedTokens,
    Trustline: ({ children }: PropsWithChildren) => {
      trustline()
      return children
    },
  },
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => 'connected',
}))
vi.mock('src/lib/wallet/namespaces/namespace-for-chain-id', () => ({
  getNamespaceForChainId: () => 'stellar',
}))
vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    disabled,
    testId,
  }: ComponentProps<'button'> & { testId?: string }) => (
    <button type="button" disabled={disabled} data-testid={testId}>
      {children}
    </button>
  ),
  DialogTrigger: ({ children }: PropsWithChildren) => children,
  Dots: ({ children }: PropsWithChildren) => children,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const restrictedToken = new StellarToken({
  chainId: StellarChainId.STELLAR,
  address: 'CCRTH4IJKVIBU6VQLRHFKDQYWXBEBJJXKDFNWVETLKUJJ7U62HBAZOIH',
  decimals: 7,
  symbol: 'deHYB',
  name: 'HYB deRWA',
})

describe.each([
  ['NEAR Intents', NearIntentsCrossChainSwapTradeButton],
  ['LayerZero', LayerZeroTradeButton],
] as const)('%s Stellar token geoblocking', (_name, TradeButton) => {
  let container: HTMLDivElement
  let root: Root

  function render(
    stellarToken: StellarToken,
    direction: 'source' | 'destination',
  ) {
    const token0 = direction === 'source' ? stellarToken : USDC[1]
    const token1 = direction === 'destination' ? stellarToken : USDC[1]
    useXswap.mockReturnValue({
      state: {
        chainId0: token0.chainId,
        chainId1: token1.chainId,
        token0,
        token1,
        swapAmount: new Amount(token0, 1_000_000n),
      },
      previewQuote: { data: {}, isLoading: false, isFetching: false },
      sourceNetworkFee: { status: 'estimated', amount: 1_000n },
    })
    act(() => root.render(<TradeButton />))
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production')
    vi.stubEnv('NODE_ENV', 'test')
    useCountryCode.mockReturnValue({
      data: 'US',
      isPending: false,
      isError: false,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllEnvs()
  })

  it.each(['source', 'destination'] as const)(
    'blocks a restricted %s token before trustlines or approvals',
    (direction) => {
      render(restrictedToken, direction)
      expect(container.textContent).toBe('deHYB unavailable in your region')
      expect(container.querySelector('button')?.disabled).toBe(true)
      expect(container.querySelector('[data-testid="swap"]')).toBeNull()
      expect(trustline).not.toHaveBeenCalled()
      expect(approval).not.toHaveBeenCalled()
    },
  )

  it('allows an unrestricted Stellar token in the US without a country lookup', () => {
    render(STELLAR_USDT0[StellarChainId.STELLAR], 'destination')
    expect(container.querySelector('[data-testid="swap"]')).not.toBeNull()
    expect(useCountryCode).not.toHaveBeenCalled()
    expect(trustline).toHaveBeenCalled()
  })

  it('allows the restricted token outside the US', () => {
    useCountryCode.mockReturnValue({
      data: 'DE',
      isPending: false,
      isError: false,
    })
    render(restrictedToken, 'destination')
    expect(container.querySelector('[data-testid="swap"]')).not.toBeNull()
    expect(trustline).toHaveBeenCalled()
  })
})
