/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  XSwapFormProvider,
  type XSwapFormState,
  useXSwapForm,
} from './xswap-form-provider'

vi.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}))
vi.mock('src/config', () => ({
  isLifiXSwapSupportedChainId: (chainId: number) =>
    [1, 42161, 8453].includes(chainId),
}))
vi.mock('src/lib/swap/near-intents', () => ({
  isNearIntentsChainId: () => false,
}))
vi.mock('src/lib/network', () => ({
  replaceNetworkSlug: (chainId: number, pathname: string) =>
    pathname.replace(/^\/[^/]+/, chainId === 42161 ? '/arbitrum' : '/ethereum'),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('cross-chain form on a unified swap page', () => {
  let root: Root
  let container: HTMLDivElement
  let form: XSwapFormState

  function ReadForm(): null {
    form = useXSwapForm()
    return null
  }

  function render(unified = true): void {
    act(() =>
      root.render(
        <XSwapFormProvider
          defaultChainId={EvmChainId.ETHEREUM}
          unified={unified}
        >
          <ReadForm />
        </XSwapFormProvider>,
      ),
    )
  }

  function params(): URLSearchParams {
    return new URLSearchParams(window.location.search)
  }

  beforeEach(() => {
    history.replaceState(
      null,
      '',
      '/ethereum/swap?chainId0=8453&chainId1=42161&token0=source&token1=destination&swapAmount=2&referrer=keep',
    )
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('reads the source from the URL and restores it when history changes', () => {
    render()
    expect(form.chainId0).toBe(EvmChainId.BASE)

    history.replaceState(null, '', '/ethereum/swap?chainId0=42161')
    render()
    expect(form.chainId0).toBe(EvmChainId.ARBITRUM)

    history.replaceState(null, '', '/ethereum/swap?chainId0=invalid')
    render()
    expect(form.chainId0).toBe(EvmChainId.ETHEREUM)
  })

  it('switches networks and tokens atomically without leaving the page', () => {
    render()
    act(() => form.switchTokens())
    render()

    expect(window.location.pathname).toBe('/ethereum/swap')
    expect(Object.fromEntries(params())).toEqual({
      chainId0: '42161',
      chainId1: '8453',
      token0: 'destination',
      token1: 'source',
      referrer: 'keep',
    })
    expect(form.chainId0).toBe(EvmChainId.ARBITRUM)
    expect(form.chainId1).toBe(EvmChainId.BASE)
  })

  it('allows the source to equal the destination without swapping tokens', () => {
    render()
    act(() => form.setChainId0(EvmChainId.ARBITRUM))
    render()

    expect(window.location.pathname).toBe('/ethereum/swap')
    expect(form.chainId0).toBe(EvmChainId.ARBITRUM)
    expect(form.chainId1).toBe(EvmChainId.ARBITRUM)
    expect(form.token0Param).toBeUndefined()
    expect(form.token1Param).toBe('destination')
    expect(form.swapAmountString).toBe('')
  })

  it('allows the destination to equal the source without swapping tokens', () => {
    render()
    act(() => form.setChainId1(EvmChainId.BASE))
    render()

    expect(window.location.pathname).toBe('/ethereum/swap')
    expect(form.chainId0).toBe(EvmChainId.BASE)
    expect(form.chainId1).toBe(EvmChainId.BASE)
    expect(form.token0Param).toBe('source')
    expect(form.token1Param).toBeUndefined()
    expect(form.swapAmountString).toBe('')
  })

  it('preserves tokens and amount when reselecting the current network', () => {
    render()
    const initialSearch = window.location.search
    act(() => form.setChainId0(EvmChainId.BASE))
    act(() => form.setChainId1(EvmChainId.ARBITRUM))
    expect(window.location.search).toBe(initialSearch)
  })

  it('preserves the legacy source and network-switching behavior by default', () => {
    render(false)
    expect(form.chainId0).toBe(EvmChainId.ETHEREUM)
    act(() => form.setChainId1(EvmChainId.ETHEREUM))
    render(false)

    expect(window.location.pathname).toBe('/arbitrum/swap')
    expect(form.chainId0).toBe(EvmChainId.ARBITRUM)
    expect(form.chainId1).toBe(EvmChainId.ETHEREUM)
    expect(form.token0Param).toBe('destination')
    expect(form.token1Param).toBe('source')
    expect(form.swapAmountString).toBe('')
  })
})
