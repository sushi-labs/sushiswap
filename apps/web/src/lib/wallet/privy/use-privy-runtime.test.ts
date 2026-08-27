import { mock } from '@wagmi/connectors'
import { http, connect, createConfig } from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  assertPrivyReconnectIsExclusive,
  isPrivyEvmReconnectPending,
  waitForWagmiIdle,
} from './use-privy-runtime'

const address = '0x0000000000000000000000000000000000000001' as EvmAddress

function createWagmiConfig() {
  return createConfig({
    chains: [mainnet],
    connectors: [mock({ accounts: [address] })],
    transports: { [mainnet.id]: http() },
  })
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Privy EVM reconnect coordination', () => {
  it('treats a Wagmi idle timeout as recoverable', async () => {
    vi.useFakeTimers()
    const config = createWagmiConfig()
    config.setState((state) => ({ ...state, status: 'reconnecting' }))

    const result = waitForWagmiIdle(config, 1_000)
    const assertion = expect(result).resolves.toBe(false)
    await vi.advanceTimersByTimeAsync(1_000)

    await assertion
  })

  it('resolves immediately when Wagmi is idle', async () => {
    await expect(waitForWagmiIdle(createWagmiConfig(), 1_000)).resolves.toBe(
      true,
    )
  })

  it('guards targeted reconnect from replacing another active wallet', async () => {
    const config = createWagmiConfig()
    const connector = config.connectors[0]
    if (!connector) throw new Error('Mock connector is unavailable')
    await connect(config, { connector })

    expect(() => assertPrivyReconnectIsExclusive(config)).toThrow(
      `Privy EVM reconnect cannot replace active connector ${connector.id}`,
    )
  })

  it('allows targeted reconnect when there is no active wallet', () => {
    expect(() =>
      assertPrivyReconnectIsExclusive(createWagmiConfig()),
    ).not.toThrow()
  })
})

describe('Privy EVM restoration state', () => {
  it('stays pending until reconnect settles and stops on load errors', () => {
    expect(
      isPrivyEvmReconnectPending({
        evmReconnect: true,
        requested: true,
        status: 'loading',
      }),
    ).toBe(true)
    expect(
      isPrivyEvmReconnectPending({
        error: new Error('chunk load failed'),
        evmReconnect: true,
        requested: true,
        status: 'error',
      }),
    ).toBe(false)
    expect(
      isPrivyEvmReconnectPending({
        evmReconnect: false,
        requested: true,
        status: 'loading',
      }),
    ).toBe(false)
  })
})
