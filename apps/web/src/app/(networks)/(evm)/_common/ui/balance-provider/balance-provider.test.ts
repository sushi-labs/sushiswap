import { EvmChainId, evmNativeAddress } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { balanceReducer, pruneInactiveBalances } from './balance-provider'
import type { ProviderState, TokenId } from './types'

const tokenId: TokenId = {
  address: evmNativeAddress,
  chainId: EvmChainId.ETHEREUM,
}

function createState(): ProviderState {
  return {
    account: undefined,
    chains: new Map(),
  }
}

function subscribe(state: ProviderState): ProviderState {
  return balanceReducer(state, {
    type: 'INCREMENT_TOKEN',
    payload: tokenId,
  })
}

function unsubscribe(state: ProviderState): ProviderState {
  return balanceReducer(state, {
    type: 'DECREMENT_TOKEN',
    payload: tokenId,
  })
}

describe('balanceReducer token subscriptions', () => {
  it('keeps the token on final unmount until the sweep prunes it', () => {
    const subscribed = subscribe(createState())
    const chain = subscribed.chains.get(EvmChainId.ETHEREUM)!
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    const unsubscribed = unsubscribe(subscribed)
    const updatedChain = unsubscribed.chains.get(EvmChainId.ETHEREUM)!

    expect(updatedChain.activeTokens.get(evmNativeAddress)).toBe(0)
    expect(updatedChain.balanceMap.size).toBe(1)

    pruneInactiveBalances(unsubscribed)

    expect(updatedChain.activeTokens.size).toBe(0)
    expect(updatedChain.balanceMap.size).toBe(0)
  })

  it('keeps the cached balance across an effect re-run', () => {
    const subscribed = subscribe(createState())
    const chain = subscribed.chains.get(EvmChainId.ETHEREUM)!
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    const resubscribed = subscribe(unsubscribe(subscribed))
    pruneInactiveBalances(resubscribed)

    expect(
      resubscribed.chains
        .get(EvmChainId.ETHEREUM)
        ?.balanceMap.get(evmNativeAddress)?.amount,
    ).toBe(1n)
  })

  it('does not accumulate tokens across repeated navigation', () => {
    let state = createState()

    for (let index = 0; index < 3; index++) {
      state = unsubscribe(subscribe(state))
    }
    pruneInactiveBalances(state)

    expect(state.chains.get(EvmChainId.ETHEREUM)?.activeTokens.size).toBe(0)
  })

  it('keeps a token and its balance while another listener remains', () => {
    const state = subscribe(subscribe(createState()))
    const chain = state.chains.get(EvmChainId.ETHEREUM)!
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    pruneInactiveBalances(unsubscribe(state))

    expect(chain.activeTokens.get(evmNativeAddress)).toBe(1)
    expect(chain.balanceMap.get(evmNativeAddress)?.amount).toBe(1n)
  })

  it('only prunes balances of inactive tokens', () => {
    const otherToken = '0x0000000000000000000000000000000000000001'
    const state = subscribe(createState())
    const chain = state.chains.get(EvmChainId.ETHEREUM)!
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })
    chain.balanceMap.set(otherToken, { amount: 2n, lastUpdated: Date.now() })

    pruneInactiveBalances(state)

    expect(chain.balanceMap.has(evmNativeAddress)).toBe(true)
    expect(chain.balanceMap.has(otherToken)).toBe(false)
  })
})

describe('balanceReducer state identity', () => {
  it('returns a new state when subscribing to an untracked token', () => {
    const state = createState()

    expect(subscribe(state)).not.toBe(state)
  })

  it('returns the same state when subscribing to a tracked token', () => {
    const state = subscribe(createState())
    state.chains.get(EvmChainId.ETHEREUM)!.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    expect(subscribe(state)).toBe(state)
  })

  it('returns the same state when unsubscribing', () => {
    const state = subscribe(createState())

    expect(unsubscribe(state)).toBe(state)
  })

  it('returns the same state across an effect re-run while the fetch is pending', () => {
    const state = subscribe(createState())

    expect(subscribe(unsubscribe(state))).toBe(state)
  })

  it('returns the same state across an effect re-run of a cached token', () => {
    const state = subscribe(createState())
    state.chains.get(EvmChainId.ETHEREUM)!.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    expect(subscribe(unsubscribe(state))).toBe(state)
  })
})
