/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  LAYERZERO_SUPPORTED_CHAIN_IDS,
  type LayerZeroChainId,
} from 'src/lib/swap/layerzero/config'
import { getLayerZeroCurrency } from 'src/lib/swap/layerzero/tokens'
import { getCurrencyParam } from 'src/lib/swap/near-intents/tokens'
import type { NearIntentsSupportedChainId } from 'src/lib/swap/near-intents/types'
import type { CurrencyInputProps } from 'src/lib/wagmi/components/web3-input/currency'
import { USDC } from 'sushi/evm'
import { STELLAR_USDC, STELLAR_USDT0 } from 'sushi/stellar'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LayerZeroCrossChainSwapWidget } from './cross-chain-swap-widget'

const { useLayerZeroXSwap, useNearIntentsXSwap } = vi.hoisted(() => ({
  useLayerZeroXSwap: vi.fn(),
  useNearIntentsXSwap: vi.fn(),
}))

vi.mock('./xswap-provider', () => ({ useLayerZeroXSwap }))
vi.mock('../near-intents/xswap-provider', () => ({ useNearIntentsXSwap }))
vi.mock('@sushiswap/ui', () => ({
  Message: ({ children }: PropsWithChildren) => <div>{children}</div>,
}))
vi.mock('../xswap-widget-frame', () => ({
  XSwapWidgetFrame: ({ children }: PropsWithChildren) => children,
}))
vi.mock('../xswap-switch-tokens-button', () => ({
  XSwapSwitchTokensButton: () => null,
}))
vi.mock('./trade-button', () => ({ LayerZeroTradeButton: () => null }))
vi.mock('./trade-stats', () => ({ LayerZeroTradeStats: () => null }))
vi.mock('../xswap-currency-input', () => ({
  XSwapCurrencyInput: ({
    id,
    currencies,
    networks,
    onSelect,
    onNetworkChange,
    allowNative,
  }: CurrencyInputProps<NearIntentsSupportedChainId, LayerZeroChainId>) => (
    <div id={id} data-allow-native={allowNative}>
      {networks?.map((network) => (
        <button
          key={network}
          type="button"
          data-network={network}
          onClick={() => onNetworkChange?.(network)}
        >
          {network}
        </button>
      ))}
      {Object.values(currencies ?? {}).map((currency) => (
        <button
          key={currency.id}
          type="button"
          data-token={getCurrencyParam(currency)}
          onClick={() => onSelect?.(currency)}
        >
          {currency.symbol}
        </button>
      ))}
    </div>
  ),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('LayerZero cross-chain selectors', () => {
  let root: Root
  let container: HTMLDivElement
  const mutate = {
    setChainId0: vi.fn(),
    setChainId1: vi.fn(),
    setToken0Param: vi.fn(),
    setToken1Param: vi.fn(),
    setSwapAmount: vi.fn(),
  }
  function render(chainId0: LayerZeroChainId, chainId1: LayerZeroChainId) {
    useLayerZeroXSwap.mockReturnValue({
      state: {
        chainId0,
        chainId1,
        token0: getLayerZeroCurrency(chainId0),
        token1: getLayerZeroCurrency(chainId1),
        swapAmountString: '',
      },
      mutate,
      previewQuote: {},
    })
    act(() => root.render(<LayerZeroCrossChainSwapWidget />))
  }

  function click(selector: string) {
    const button = container.querySelector<HTMLButtonElement>(selector)
    expect(button).not.toBeNull()
    act(() => button?.click())
  }

  beforeEach(() => {
    vi.resetAllMocks()
    useNearIntentsXSwap.mockReturnValue({
      currenciesByChain: {
        [-4]: {
          [STELLAR_USDC[-4].address]: STELLAR_USDC[-4],
          [STELLAR_USDT0[-4].address]: STELLAR_USDT0[-4],
        },
      },
      isLoadingTokens: false,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each([
    [-4, 1],
    [1, -4],
  ] as const)(
    'shows LayerZero networks and the current route currencies for %s → %s',
    (chainId0, chainId1) => {
      render(chainId0, chainId1)
      for (const [id, chainId] of [
        ['swap-from', chainId0],
        ['swap-to', chainId1],
      ] as const) {
        expect(
          Array.from(
            container.querySelectorAll(`#${id} [data-network]`),
            (button) => Number(button.getAttribute('data-network')),
          ),
        ).toEqual([...LAYERZERO_SUPPORTED_CHAIN_IDS])
        expect(
          container.querySelector(
            `#${id} [data-token="${getLayerZeroCurrency(chainId).address}"]`,
          ),
        ).not.toBeNull()
        expect(
          container.querySelector(`#${id}`)?.getAttribute('data-allow-native'),
        ).toBe('false')
        if (chainId === -4) {
          expect(container.querySelector(`#${id}`)?.textContent).toContain(
            'USDC',
          )
        } else {
          expect(
            container.querySelector(`#${id} [data-token="${USDC[1].address}"]`),
          ).toBeNull()
          expect(
            container.querySelector(`#${id} [data-token="NATIVE"]`),
          ).toBeNull()
        }
      }
    },
  )

  it('allows changing either side to another LayerZero network', () => {
    render(-4, 1)
    click('#swap-to [data-network="42161"]')
    expect(mutate.setChainId1).toHaveBeenCalledWith(42161)
    render(1, -4)
    click('#swap-from [data-network="10"]')
    expect(mutate.setChainId0).toHaveBeenCalledWith(10)
  })

  it('does not show networks outside the LayerZero integration', () => {
    render(-4, 1)
    expect(container.querySelector('[data-network="146"]')).toBeNull()
    expect(container.querySelector('[data-network="59144"]')).toBeNull()
  })

  it('allows another Stellar token while keeping EVM selection on the OFT', () => {
    render(-4, 1)
    click(`#swap-from [data-token="${STELLAR_USDC[-4].address}"]`)
    expect(mutate.setToken0Param).toHaveBeenCalledWith(STELLAR_USDC[-4].address)
    click(`#swap-to [data-token="${getLayerZeroCurrency(1).address}"]`)
    expect(mutate.setToken1Param).toHaveBeenCalledWith(
      getLayerZeroCurrency(1).address,
    )
    render(1, -4)
    click(`#swap-to [data-token="${STELLAR_USDC[-4].address}"]`)
    expect(mutate.setToken1Param).toHaveBeenCalledWith(STELLAR_USDC[-4].address)
  })
})
