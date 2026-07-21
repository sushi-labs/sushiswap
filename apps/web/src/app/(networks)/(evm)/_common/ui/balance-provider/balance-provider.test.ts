import { EvmChainId, evmNativeAddress } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { balanceReducer } from './balance-provider'
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
  it('removes the active token and cached balance on final unmount', () => {
    const subscribed = subscribe(createState())
    const chain = subscribed.chains.get(EvmChainId.ETHEREUM)!
    chain.balanceMap.set(evmNativeAddress, {
      amount: 1n,
      lastUpdated: Date.now(),
    })

    const unsubscribed = unsubscribe(subscribed)
    const updatedChain = unsubscribed.chains.get(EvmChainId.ETHEREUM)!

    expect(updatedChain.activeTokens.size).toBe(0)
    expect(updatedChain.balanceMap.size).toBe(0)
  })

  it('does not accumulate tokens across repeated navigation', () => {
    let state = createState()

    for (let index = 0; index < 3; index++) {
      state = unsubscribe(subscribe(state))
    }

    expect(state.chains.get(EvmChainId.ETHEREUM)?.activeTokens.size).toBe(0)
  })
})
