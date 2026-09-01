import { mock } from '@wagmi/connectors'
import { http, type CreateConnectorFn, createConfig } from '@wagmi/core'
import { mainnet } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'
import {
  createLazyConnector,
  withConnectorSetupErrorLogging,
} from './connector-utils'

describe('connector utilities', () => {
  it('reports setup failures and preserves the augmented connector context', async () => {
    const error = new Error('SDK failed to load')
    const setup = vi.fn().mockRejectedValue(error)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const baseConnectorFn = mock({
      accounts: ['0x0000000000000000000000000000000000000001'],
    })
    const sourceConnectorFn: CreateConnectorFn = (config) => ({
      ...baseConnectorFn(config),
      setup,
    })
    const connectorFn = withConnectorSetupErrorLogging(
      sourceConnectorFn,
      'MetaMask',
    )
    const config = createConfig({
      chains: [mainnet],
      connectors: [connectorFn],
      transports: { [mainnet.id]: http() },
    })
    const connector = config.connectors[0]

    await expect(connector.setup?.()).resolves.toBeUndefined()
    expect(setup.mock.instances).toEqual([connector, connector])
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to set up MetaMask connector',
      error,
    )

    consoleError.mockRestore()
  })

  it('loads a lazy connector only during setup', async () => {
    const setup = vi.fn()
    const baseConnectorFn = mock({
      accounts: ['0x0000000000000000000000000000000000000001'],
    })
    const sourceConnectorFn: CreateConnectorFn = (config) => ({
      ...baseConnectorFn(config),
      setup,
    })
    const load = vi.fn().mockResolvedValue(sourceConnectorFn)
    const connectorFn = createLazyConnector({
      id: 'lazy',
      load,
      name: 'Lazy',
      type: 'lazy',
    })

    expect(load).not.toHaveBeenCalled()

    const config = createConfig({
      chains: [mainnet],
      connectors: [connectorFn],
      transports: { [mainnet.id]: http() },
    })
    const connector = config.connectors[0]

    await vi.waitFor(() => expect(setup).toHaveBeenCalledOnce())
    expect(load).toHaveBeenCalledOnce()
    expect(setup.mock.instances).toEqual([connector])
  })

  it('retries after a lazy connector load fails', async () => {
    const error = new Error('Chunk failed to load')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const accounts = ['0x0000000000000000000000000000000000000001'] as const
    const baseConnectorFn = mock({
      accounts: ['0x0000000000000000000000000000000000000001'],
    })
    const sourceConnectorFn: CreateConnectorFn = (config) => ({
      ...baseConnectorFn(config),
      async getAccounts() {
        return accounts
      },
    })
    const load = vi
      .fn<() => Promise<CreateConnectorFn>>()
      .mockRejectedValueOnce(error)
      .mockResolvedValue(sourceConnectorFn)
    const connectorFn = createLazyConnector({
      id: 'lazy',
      load,
      name: 'Lazy',
      type: 'lazy',
    })
    const config = createConfig({
      chains: [mainnet],
      connectors: [connectorFn],
      transports: { [mainnet.id]: http() },
    })

    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to load Lazy connector',
        error,
      ),
    )
    await expect(config.connectors[0].getAccounts()).resolves.toEqual(accounts)
    expect(load).toHaveBeenCalledTimes(2)

    consoleError.mockRestore()
  })
})
