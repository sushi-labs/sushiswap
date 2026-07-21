/** @vitest-environment jsdom */

import { act, createElement } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { LowercaseMap } from 'sushi'
import { EvmChainId, evmNativeAddress } from 'sushi/evm'
import type { Address } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Provider, ProviderChainState, UseBalancesReturn } from './types'

let provider: Provider

vi.mock('./balance-provider', () => ({
  useBalanceProvider: () => provider,
}))

import { useEvmBalances } from './use-evm-balances'

const tokenAddresses: Address[] = [evmNativeAddress]

function createChain(): ProviderChainState {
  return {
    chainId: EvmChainId.ETHEREUM,
    isFetching: false,
    failureCount: 1,
    lastError: {
      message: 'RPC unavailable',
      timestamp: Date.now(),
    },
    activeTokens: new LowercaseMap<Address, number>(),
    balanceMap: new LowercaseMap(),
  }
}

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('useEvmBalances', () => {
  let container: HTMLDivElement
  let root: Root
  let result: UseBalancesReturn<EvmChainId>

  function Probe() {
    result = useEvmBalances(EvmChainId.ETHEREUM, tokenAddresses)
    return null
  }

  function render(chain: ProviderChainState) {
    provider = {
      state: {
        account: undefined,
        chains: new Map([[EvmChainId.ETHEREUM, chain]]),
      },
      mutate: {
        incrementToken: vi.fn(),
        decrementToken: vi.fn(),
        refetchChain: vi.fn().mockResolvedValue(undefined),
      },
    }

    act(() => root.render(createElement(Probe)))
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('surfaces a transport failure when requested balances are unavailable', () => {
    render(createChain())

    expect(result.data).toBeUndefined()
    expect(result.isError).toBe(true)
  })

  it('keeps a known balance usable during a transport failure', () => {
    const chain = createChain()
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    render(chain)

    expect(result.data?.get(evmNativeAddress)).toBe(1n)
    expect(result.isError).toBe(false)
  })
})
