/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { ConcentratedLiquidityURLStateProvider } from './concentrated-liquidity-url-state-provider'
import { getFeeOptions } from './select-fee-concentrated-widget'

const mocks = vi.hoisted(() => ({ params: new URLSearchParams() }))
vi.mock('next/navigation', () => ({
  usePathname: () => '/robinhood/pool/v3/add',
  useSearchParams: () => mocks.params,
}))
vi.mock('src/lib/wagmi/hooks/tokens/use-token-with-cache', () => ({
  useTokenWithCache: () => ({ data: undefined, isInitialLoading: false }),
}))
vi.mock('src/lib/hooks/use-pools-by-token-pair', () => ({
  usePoolsByTokenPair: () => ({ data: [], isLoading: false }),
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it.each([EvmChainId.ROBINHOOD, EvmChainId.ROOTSTOCK])(
  'omits the disabled 0.01%% tier on chain %s',
  (chainId) => {
    expect(getFeeOptions(chainId).map((option) => option.value)).toEqual([
      500, 3000, 10000,
    ])
  },
)

it('enables tiers by default and preserves Katana extended tiers', () => {
  expect(
    getFeeOptions(EvmChainId.ETHEREUM).map((option) => option.value),
  ).toEqual([100, 500, 3000, 10000])
  expect(
    getFeeOptions(EvmChainId.KATANA).map((option) => option.value),
  ).toEqual([100, 500, 3000, 10000, 20000, 40000])
})

it.each([
  { chainId: EvmChainId.ROBINHOOD, requested: 100, expected: 3000 },
  { chainId: EvmChainId.ROOTSTOCK, requested: 100, expected: 3000 },
  { chainId: EvmChainId.ETHEREUM, requested: 100, expected: 100 },
  { chainId: EvmChainId.ROBINHOOD, requested: 500, expected: 500 },
])(
  'uses an enabled fee from URL state on chain $chainId: $requested -> $expected',
  async ({ chainId, requested, expected }) => {
    mocks.params = new URLSearchParams({ feeAmount: String(requested) })
    const container = document.createElement('div')
    const root = createRoot(container)
    try {
      await act(async () =>
        root.render(
          <ConcentratedLiquidityURLStateProvider chainId={chainId}>
            {(state) => <output>{state.feeAmount}</output>}
          </ConcentratedLiquidityURLStateProvider>,
        ),
      )
      expect(container.textContent).toBe(String(expected))
    } finally {
      act(() => root.unmount())
    }
  },
)
