import {
  ConnectionController,
  CoreHelperUtil,
  ModalController,
  RouterController,
} from '@reown/appkit-controllers'
import { mock } from '@wagmi/connectors'
import {
  http,
  createConfig,
  createConnector,
  createStorage,
  noopStorage,
} from '@wagmi/core'
import { mainnet } from 'viem/chains'
import { describe, expect, it } from 'vitest'
import {
  OATH_WALLET,
  connectOathWallet,
  presentOathWallet,
  queueEvmWalletConnection,
} from './oath-wallet'

const controllers = { ConnectionController, ModalController, RouterController }
const account = '0x0000000000000000000000000000000000000001' as const
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Oath WalletConnect presentation', () => {
  it('routes the actual SDK modal to Oath and restores generic presentation on disposal', async () => {
    const dispose = presentOathWallet(controllers)
    try {
      ModalController.state.open = true
      await tick()
      expect(RouterController.state.view).toBe('ConnectingWalletConnect')
      expect(RouterController.state.data?.wallet).toEqual(OATH_WALLET)
      RouterController.reset('ConnectingWalletConnectBasic')
      await tick()
      expect(RouterController.state.view).toBe('ConnectingWalletConnect')
    } finally {
      dispose()
      ModalController.state.open = false
    }
    expect(RouterController.state.view).toBe('Connect')
    ModalController.state.open = true
    RouterController.reset('ConnectingWalletConnectBasic')
    await tick()
    expect(RouterController.state.view).toBe('ConnectingWalletConnectBasic')
    ModalController.state.open = false
  })

  it('preserves the full pairing URI in the native iOS link', () => {
    const pairing = `wc:${'a'.repeat(64)}@2?relay-protocol=irn&symKey=${'b'.repeat(64)}&expiryTimestamp=2000000000`
    const { redirect } = CoreHelperUtil.formatNativeUrl(
      OATH_WALLET.mobile_link,
      pairing,
    )
    const url = new URL(redirect)
    expect(url.protocol).toBe('oathwallet:')
    expect(url.hostname).toBe('wc')
    expect(url.searchParams.get('uri')).toBe(pairing)
    expect([...url.searchParams]).toHaveLength(1)
  })

  it.each([false, true])(
    'clears a stored session before pairing, including rejection=%s',
    async (reject) => {
      const events: string[] = []
      const provider = {
        session: { topic: 'synthetic-session' } as object | undefined,
      }
      const factory = createConnector((config) => {
        const delegate = mock({ accounts: [account] })(config)
        return {
          ...delegate,
          id: 'walletConnect',
          name: 'WalletConnect',
          type: 'walletConnect',
          async connect<withCapabilities extends boolean = false>(parameters?: {
            withCapabilities?: withCapabilities | boolean
          }) {
            events.push('pair')
            expect(provider.session).toBeUndefined()
            ModalController.state.open = true
            await tick()
            expect(RouterController.state.data?.wallet?.name).toBe(
              'Oath Wallet',
            )
            if (reject) throw new Error('User rejected connection')
            return delegate.connect<withCapabilities>(parameters)
          },
          async disconnect() {
            events.push('disconnect')
            provider.session = undefined
          },
          async getProvider() {
            return provider
          },
          async getAccounts() {
            return [account]
          },
          async getChainId() {
            return 1
          },
          async isAuthorized() {
            return false
          },
          onAccountsChanged() {},
          onChainChanged() {},
          onDisconnect() {},
        }
      })
      const config = createConfig({
        chains: [mainnet],
        connectors: [],
        transports: { 1: http() },
        storage: createStorage({ storage: noopStorage }),
        multiInjectedProviderDiscovery: false,
      })
      try {
        const result = connectOathWallet(config, factory)
        if (reject)
          await expect(result).rejects.toThrow('User rejected connection')
        else {
          expect((await result).accounts).toEqual([account])
          expect(
            config.state.connections.get(config.state.current ?? '')?.connector
              .id,
          ).toBe('walletConnect')
        }
        expect(events).toEqual(['disconnect', 'pair'])
        expect(RouterController.state.view).toBe('Connect')
        expect(config.state.status).toBe(reject ? 'disconnected' : 'connected')
      } finally {
        ModalController.state.open = false
      }
    },
  )

  it('serializes selections and lets the next selection run after cancellation', async () => {
    const events: string[] = []
    let release: () => void = () => {}
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const first = queueEvmWalletConnection(async () => {
      events.push('oath')
      await gate
      throw new Error('cancelled')
    })
    const rejected = expect(first).rejects.toThrow('cancelled')
    const second = queueEvmWalletConnection(async () => {
      events.push('generic')
    })
    await tick()
    expect(events).toEqual(['oath'])
    release()
    await rejected
    await second
    expect(events).toEqual(['oath', 'generic'])
  })
})
