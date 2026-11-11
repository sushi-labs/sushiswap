/** @vitest-environment jsdom */

import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  useStellarWalletDiscovery,
  useStellarWallets,
} from './use-stellar-wallets'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const mocks = vi.hoisted(() => ({
  getStellarWalletKit: vi.fn(),
  refreshSupportedWallets: vi.fn(),
}))

vi.mock('../config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../config')>()),
  getStellarWalletKit: mocks.getStellarWalletKit,
}))

vi.mock('src/lib/wallet/hooks/use-recent-wallets', () => ({
  useRecentWallets: () => ({ isRecentWallet: () => false }),
}))

function Probe() {
  const wallets = useStellarWalletDiscovery()
  return <output>{wallets === undefined ? 'Loading' : wallets.length}</output>
}

describe('Stellar wallet discovery loading state', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getStellarWalletKit.mockResolvedValue({
      refreshSupportedWallets: mocks.refreshSupportedWallets,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.restoreAllMocks()
  })

  it('keeps the existing wallet-list hook compatible while discovery is pending', async () => {
    const discovery = Promise.withResolvers<ISupportedWallet[]>()
    mocks.refreshSupportedWallets.mockReturnValue(discovery.promise)
    function LegacyProbe() {
      const wallets = useStellarWallets()
      return <output>{wallets.length}</output>
    }

    await act(async () => root.render(<LegacyProbe />))
    expect(container.textContent).toBe('0')
    await act(async () => discovery.resolve([]))
  })

  it('stays loading until discovery resolves, even when it returns no wallets', async () => {
    const discovery = Promise.withResolvers<ISupportedWallet[]>()
    mocks.refreshSupportedWallets.mockReturnValue(discovery.promise)

    await act(async () => root.render(<Probe />))
    expect(container.textContent).toBe('Loading')

    await act(async () => discovery.resolve([]))
    expect(container.textContent).toBe('0')
  })

  it.each(['initialization', 'discovery'])(
    'stops loading and reports an error when %s fails',
    async (stage) => {
      const error = new Error('Wallet discovery unavailable')
      const reportError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      if (stage === 'initialization') {
        mocks.getStellarWalletKit.mockRejectedValue(error)
      } else {
        mocks.refreshSupportedWallets.mockRejectedValue(error)
      }

      await act(async () => root.render(<Probe />))

      expect(container.textContent).toBe('0')
      expect(reportError).toHaveBeenCalledWith(
        'Failed to load Stellar wallets',
        error,
      )
    },
  )
})
