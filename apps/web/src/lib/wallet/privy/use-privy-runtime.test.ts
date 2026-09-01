import { describe, expect, it } from 'vitest'
import { isPrivyEvmReconnectPending } from './use-privy-runtime'

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
