import { http, createConfig } from '@wagmi/core'
import { mainnet } from 'viem/chains'
import { describe, expect, it, vi } from 'vitest'
import {
  evmConnectorFactories,
  getEvmConnectorFactory,
} from './connector-factories'

const { metaMaskSetup } = vi.hoisted(() => ({
  metaMaskSetup: vi.fn(),
}))

vi.mock('@wagmi/connectors', async (importOriginal) => {
  const original = await importOriginal<typeof import('@wagmi/connectors')>()

  return {
    ...original,
    metaMask: () => () => ({
      id: 'metaMaskSDK',
      name: 'MetaMask',
      setup: metaMaskSetup,
      type: 'metaMask',
    }),
  }
})

describe('EVM connector factories', () => {
  it('only resolves declared connector ids', () => {
    expect(getEvmConnectorFactory('walletConnect')).toBe(
      evmConnectorFactories.walletConnect,
    )
    expect(getEvmConnectorFactory('__proto__')).toBeUndefined()
    expect(getEvmConnectorFactory('constructor')).toBeUndefined()
  })

  it('contains MetaMask setup rejections', async () => {
    metaMaskSetup.mockRejectedValue(new Error('SDK failed to load'))

    const config = createConfig({
      chains: [mainnet],
      connectors: [evmConnectorFactories.metaMaskSDK()],
      multiInjectedProviderDiscovery: false,
      ssr: true,
      transports: { [mainnet.id]: http() },
    })

    const connector = config.connectors[0]
    await expect(connector?.setup?.()).resolves.toBeUndefined()
    expect(metaMaskSetup).toHaveBeenCalledTimes(2)
    expect(metaMaskSetup.mock.instances).toEqual([connector, connector])
  })
})
