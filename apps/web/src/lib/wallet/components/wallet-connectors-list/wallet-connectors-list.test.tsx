/** @vitest-environment jsdom */

import { type ComponentType, act, useState } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WalletWithState } from '../../types'
import type { ConnectWalletButtonProps } from '../connect-wallet-button/types'
import ConnectorsList from './wallet-connectors-list'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const state: { wallets: WalletWithState[]; isStellarLoading: boolean } =
  vi.hoisted(() => ({
    wallets: [],
    isStellarLoading: false,
  }))

vi.mock('./use-wallets-list', () => ({
  useWalletsList: () => state.wallets,
}))

vi.mock('./wallets-registry', () => ({
  useWalletsRegistry: () => ({
    wallets: new Map(state.isStellarLoading ? [] : [['stellar', []]]),
  }),
  withWalletsRegistry<P extends object>(component: ComponentType<P>) {
    return component
  },
}))

vi.mock('./wallet-connectors-list-button', () => ({
  WalletConnectorsListButton({
    wallet,
    onClick,
    onSuccess,
  }: Pick<ConnectWalletButtonProps, 'wallet' | 'onClick' | 'onSuccess'>) {
    return (
      <button
        type="button"
        data-wallet-id={wallet.id}
        onClick={onClick ?? (() => onSuccess?.('test-account'))}
      >
        {wallet.name}
      </button>
    )
  },
}))

function createWallet(
  index: number,
  overrides: Partial<WalletWithState> = {},
): WalletWithState {
  return {
    id: `evm:test-${index}`,
    name: `Wallet ${index}`,
    namespace: 'evm',
    adapterId: 'test',
    icon: '',
    isAvailable: true,
    isInstalled: false,
    isRecent: false,
    ...overrides,
  }
}

function Harness({ onConnect }: { onConnect?: () => void }) {
  const [showOtherWallets, setShowOtherWallets] = useState(false)
  return (
    <>
      {showOtherWallets ? (
        <button type="button" onClick={() => setShowOtherWallets(false)}>
          Back
        </button>
      ) : null}
      <ConnectorsList
        namespace="evm"
        showOtherWallets={showOtherWallets}
        onShowOtherWallets={() => setShowOtherWallets(true)}
        onConnect={onConnect}
      />
    </>
  )
}

describe('Other Wallets navigation', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    state.wallets = []
    state.isStellarLoading = false
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function walletNames(): (string | null)[] {
    return [...container.querySelectorAll('[data-wallet-id]')].map(
      (element) => element.textContent,
    )
  }

  function button(name: string): HTMLButtonElement | undefined {
    return [...container.querySelectorAll('button')].find(
      (element) => element.textContent === name,
    )
  }

  it('shows a Stellar skeleton until discovery completes, including an empty result', () => {
    state.isStellarLoading = true
    act(() => root.render(<ConnectorsList namespace="stellar" />))

    const loading = container.querySelector('[role="status"]')
    expect(loading?.getAttribute('aria-label')).toBe('Loading wallets')
    expect(loading?.querySelectorAll('button:disabled')).toHaveLength(4)

    state.wallets = [
      createWallet(0, { namespace: 'stellar', name: 'Freighter' }),
    ]
    state.isStellarLoading = false
    act(() => root.render(<ConnectorsList namespace="stellar" />))
    expect(container.querySelector('[role="status"]')).toBeNull()
    expect(walletNames()).toEqual(['Freighter'])

    state.wallets = []
    act(() => root.render(<ConnectorsList namespace="stellar" />))
    expect(container.querySelector('[role="status"]')).toBeNull()
  })

  it('does not block EVM wallets while Stellar discovery is pending', () => {
    state.isStellarLoading = true
    state.wallets = [createWallet(0)]
    act(() => root.render(<Harness />))

    expect(container.querySelector('[role="status"]')).toBeNull()
    expect(walletNames()).toEqual(['Wallet 0'])
  })

  it.each([0, 4])('does not show an empty submenu for %i wallets', (count) => {
    state.wallets = Array.from({ length: count }, (_, index) =>
      createWallet(index),
    )
    act(() => root.render(<Harness />))

    expect(walletNames()).toHaveLength(count)
    expect(button('Other Wallets')).toBeUndefined()
  })

  it('keeps priority, separates login methods, and connects overflow wallets', () => {
    const onConnect = vi.fn()
    state.wallets = [
      ...Array.from({ length: 6 }, (_, index) => createWallet(index)),
      createWallet(6, { isRecent: true }),
      createWallet(7, { name: 'Email', loginMethod: 'email', isRecent: true }),
      createWallet(8, { name: 'X', loginMethod: 'twitter' }),
      createWallet(9, { namespace: 'svm', name: 'Solana wallet' }),
    ]
    act(() => root.render(<Harness onConnect={onConnect} />))

    expect(walletNames()).toEqual([
      'Wallet 6',
      'Wallet 0',
      'Wallet 1',
      'Wallet 2',
      'Email',
      'X',
    ])
    act(() => button('Other Wallets')?.click())
    expect(walletNames()).toEqual(['Wallet 3', 'Wallet 4', 'Wallet 5'])
    expect(button('Other Wallets')).toBeUndefined()

    act(() => button('Wallet 5')?.click())
    expect(onConnect).toHaveBeenCalledOnce()

    act(() => button('Back')?.click())
    expect(walletNames()).toEqual([
      'Wallet 6',
      'Wallet 0',
      'Wallet 1',
      'Wallet 2',
      'Email',
      'X',
    ])
    expect(document.activeElement).toBe(button('Other Wallets'))
  })
})
