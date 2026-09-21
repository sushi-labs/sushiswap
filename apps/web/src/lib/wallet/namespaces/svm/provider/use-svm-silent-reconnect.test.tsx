/** @vitest-environment jsdom */

import { ConnectorClient } from '@solana/connector'
import type { Wallet } from '@wallet-standard/base'
import { StrictMode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { getConnectorConfig } from 'src/app/(networks)/(non-evm)/solana/_common/config/connector'
import { setPrivySvmReconnect } from 'src/lib/wallet/privy-storage'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useSvmSilentReconnect } from './use-svm-silent-reconnect'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root
let container: HTMLDivElement
let client: ConnectorClient
let wallets: Wallet[]
let register: () => void

const account = {
  address: '11111111111111111111111111111111',
  publicKey: new Uint8Array(32),
  chains: ['solana:mainnet'] as const,
  features: [],
}
const connect = vi.fn(async (_options?: { silent?: boolean }) => ({
  accounts: [account],
}))
const wallet: Wallet = {
  version: '1.0.0',
  name: 'Test Wallet',
  icon: 'data:image/png;base64,AA==',
  chains: ['solana:mainnet'],
  accounts: [],
  features: {
    'standard:connect': { version: '1.0.0', connect },
    'standard:events': { version: '1.0.0', on: () => () => undefined },
    'solana:signTransaction': { version: '1.0.0' },
  },
}

function Probe() {
  useSvmSilentReconnect(client)
  return null
}

async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    )
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  connect.mockReset().mockResolvedValue({ accounts: [account] })
  localStorage.clear()
  wallets = [wallet]
  register = () => undefined
  Object.defineProperty(window.navigator, 'wallets', {
    configurable: true,
    value: {
      get: () => wallets,
      on: (event: string, listener: () => void) => {
        if (event === 'register') register = listener
        return () => undefined
      },
    },
  })
  const config = getConnectorConfig()
  config.storage?.wallet.set(wallet.name)
  client = new ConnectorClient(config)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  client.destroy()
  container.remove()
  vi.useRealTimers()
})

it('restores silently once in StrictMode, with built-in reconnect disabled', async () => {
  expect(getConnectorConfig().autoConnect).toBe(false)
  await render()
  await act(async () => vi.advanceTimersByTimeAsync(5_000))
  await render()
  expect(connect.mock.calls).toEqual([[{ silent: true }]])
  expect(client.getSnapshot().connected).toBe(true)
})

it.each(['empty', 'rejected'])(
  'keeps a %s session saved and allows manual connect',
  async (result) => {
    if (result === 'empty') connect.mockResolvedValueOnce({ accounts: [] })
    else connect.mockRejectedValueOnce(new Error('Wallet locked'))

    await render()
    await act(async () => vi.advanceTimersByTimeAsync(5_000))
    await render()
    expect(connect.mock.calls).toEqual([[{ silent: true }]])
    expect(client.getSnapshot().wallet.status).toBe('error')
    expect(getConnectorConfig().storage?.wallet.get()).toBe(wallet.name)

    const connector = client.getSnapshot().connectors[0]
    if (!connector) throw new Error('Test wallet was not detected')
    await act(async () => client.connectWallet(connector.id))
    expect(connect).toHaveBeenLastCalledWith({ silent: false })
    expect(client.getSnapshot().connected).toBe(true)
  },
)

it('waits for delayed wallet registration', async () => {
  wallets = []
  register()
  await render()
  await act(async () => vi.advanceTimersByTimeAsync(2_000))
  expect(connect).not.toHaveBeenCalled()
  await act(async () => {
    wallets = [wallet]
    register()
    await vi.advanceTimersByTimeAsync(20)
  })
  expect(connect.mock.calls).toEqual([[{ silent: true }]])
})

it.each(['missing', 'privy-name', 'privy-session'])(
  'skips %s preferences',
  async (scenario) => {
    if (scenario === 'missing')
      getConnectorConfig().storage?.wallet.set(undefined)
    if (scenario === 'privy-name')
      getConnectorConfig().storage?.wallet.set('Privy')
    if (scenario === 'privy-session') setPrivySvmReconnect(true)
    await render()
    await act(async () => vi.advanceTimersByTimeAsync(5_000))
    expect(connect).not.toHaveBeenCalled()
  },
)

it('does not reconnect after a user disconnects while discovery is pending', async () => {
  wallets = []
  register()
  await render()
  await act(async () => {
    await client.disconnectWallet()
    wallets = [wallet]
    register()
  })
  expect(connect).not.toHaveBeenCalled()
})

it('does not interrupt a manual connect that starts as the wallet is detected', async () => {
  wallets = []
  register()
  await render()
  await act(async () => {
    wallets = [wallet]
    register()
    const connector = client.getSnapshot().connectors[0]
    if (!connector) throw new Error('Test wallet was not detected')
    await client.connectWallet(connector.id)
  })
  expect(connect.mock.calls).toEqual([[{ silent: false }]])
})

it.each(['timeout', 'unmount'])('stops waiting after %s', async (reason) => {
  wallets = []
  register()
  await render()
  if (reason === 'timeout') {
    await act(async () => vi.advanceTimersByTimeAsync(5_000))
  } else {
    act(() => root.render(null))
  }
  await act(async () => {
    wallets = [wallet]
    register()
    await vi.advanceTimersByTimeAsync(20)
  })
  expect(connect).not.toHaveBeenCalled()
})
