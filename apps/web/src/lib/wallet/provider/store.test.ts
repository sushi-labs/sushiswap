/** @vitest-environment jsdom */

import { createElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { EvmChainId } from 'sushi/evm'
import { type SvmAddress, SvmChainId } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WalletConnection } from '../types'
import {
  addWalletConnection,
  clearWalletConnections,
  getConnections,
  setActiveWalletConnection,
  setWalletNamespaceRestoring,
  useWalletRestorationState,
  watchConnections,
} from './store'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

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

  it('replaces the previous wallet for a single-wallet namespace', () => {
    addWalletConnection({
      id: 'svm:solflare',
      name: 'Solflare',
      namespace: 'svm',
      account: '11111111111111111111111111111111' as SvmAddress,
      chainId: SvmChainId.SOLANA,
    })

    setActiveWalletConnection({
      id: 'svm:privy',
      name: 'Email',
      namespace: 'svm',
      account: '22222222222222222222222222222222' as SvmAddress,
      chainId: SvmChainId.SOLANA,
    })

    expect(getConnections()).toEqual([
      expect.objectContaining({
        id: 'svm:privy',
        account: '22222222222222222222222222222222',
      }),
    ])
  })

  it('does not re-enter initial restoration after it finishes', () => {
    const container = document.createElement('div')
    const root = createRoot(container)

    function Probe() {
      const restorationState = useWalletRestorationState()
      return createElement('output', {
        'data-restoring': restorationState.evm,
      })
    }

    act(() => root.render(createElement(Probe)))
    expect(container.querySelector('output')?.dataset.restoring).toBe('true')

    act(() => setWalletNamespaceRestoring('evm', false))
    expect(container.querySelector('output')?.dataset.restoring).toBe('false')

    act(() => setWalletNamespaceRestoring('evm', true))
    expect(container.querySelector('output')?.dataset.restoring).toBe('false')

    act(() => root.unmount())
  })
})
