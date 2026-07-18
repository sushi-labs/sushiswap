import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WalletConnection } from '../types'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections,
  watchConnections,
} from './store'

const account = '0x0000000000000000000000000000000000000001'

function clearStore() {
  clearWalletConnections('evm')
  clearWalletConnections('svm')
  clearWalletConnections('stellar')
}

describe('wallet connection store', () => {
  beforeEach(clearStore)
  afterEach(clearStore)

  it('replaces same-connector metadata after an EVM chain switch', () => {
    const listener = vi.fn()
    const unwatch = watchConnections(listener)

    addWalletConnection({
      id: 'evm:injected',
      name: 'Injected',
      namespace: 'evm',
      account,
      chainId: EvmChainId.ETHEREUM,
      icon: 'ethereum.svg',
    })
    addWalletConnection({
      id: 'evm:injected',
      name: 'Injected',
      namespace: 'evm',
      account,
      chainId: EvmChainId.ARBITRUM,
      icon: 'arbitrum.svg',
    })

    expect(getConnections()).toEqual([
      expect.objectContaining({
        chainId: EvmChainId.ARBITRUM,
        icon: 'arbitrum.svg',
      }),
    ])
    expect(listener).toHaveBeenCalledTimes(2)

    unwatch()
  })

  it('does not emit for identical connection metadata', () => {
    const connection: WalletConnection<typeof EvmChainId.ETHEREUM> = {
      id: 'evm:injected',
      name: 'Injected',
      namespace: 'evm' as const,
      account,
      chainId: EvmChainId.ETHEREUM,
      icon: 'ethereum.svg',
    }
    addWalletConnection(connection)

    const listener = vi.fn()
    const unwatch = watchConnections(listener)
    addWalletConnection(connection)

    expect(listener).not.toHaveBeenCalled()
    unwatch()
  })
})
