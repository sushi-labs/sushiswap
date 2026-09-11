import type { Connector } from '@wagmi/core'
import { describe, expect, it } from 'vitest'
import { isInjectedConnector } from './injected'

function connector({
  id,
  name,
  type,
}: {
  id: string
  name: string
  type: string
}): Connector {
  return { id, name, type } as Connector
}

describe('isInjectedConnector', () => {
  it('excludes the stable Privy connector by type and ID', () => {
    expect(
      isInjectedConnector(
        connector({
          id: 'io.privy.wallet',
          name: 'Email',
          type: 'privy',
        }),
      ),
    ).toBe(false)
  })

  it('excludes legacy address-scoped Privy injected connectors', () => {
    expect(
      isInjectedConnector(
        connector({
          id: 'io.privy.wallet.0x0000000000000000000000000000000000000001',
          name: 'Privy Wallet',
          type: 'injected',
        }),
      ),
    ).toBe(false)
  })

  it('retains ordinary injected wallet classification', () => {
    expect(
      isInjectedConnector(
        connector({
          id: 'io.rabby',
          name: 'Rabby',
          type: 'injected',
        }),
      ),
    ).toBe(true)
  })
})
