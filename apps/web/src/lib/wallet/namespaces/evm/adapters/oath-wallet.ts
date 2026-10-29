import type * as AppKitControllers from '@reown/appkit-controllers'
import {
  type Config,
  type ConnectReturnType,
  type Connector,
  type CreateConnectorFn,
  connect,
} from '@wagmi/core'

export const OATH_WALLET_ID = 'evm:oath-wallet'

// Local wallet metadata, not a claim of WalletGuide approval or an extension.
export const OATH_WALLET = {
  id: 'oath-ios',
  name: 'Oath Wallet',
  homepage: 'https://oathwallet.org',
  image_url: '/wallets/oath-wallet.svg',
  mobile_link: 'oathwallet://',
  app_store: 'https://apps.apple.com/app/id6780187283',
}

type Controllers = Pick<
  typeof AppKitControllers,
  'ModalController' | 'ConnectionController' | 'RouterController'
>

export function presentOathWallet({
  ModalController,
  ConnectionController,
  RouterController,
}: Controllers): () => void {
  ConnectionController.resetUri()
  function showOath(): void {
    if (ModalController.state.open) {
      RouterController.reset('ConnectingWalletConnect', { wallet: OATH_WALLET })
    }
  }
  const subscriptions = [
    ModalController.subscribeKey('open', (open) => {
      if (open) showOath()
    }),
    RouterController.subscribeKey('view', (view) => {
      if (view === 'ConnectingWalletConnectBasic') showOath()
    }),
  ]
  return function dispose(): void {
    for (const unsubscribe of subscriptions) unsubscribe()
    ConnectionController.resetUri()
    RouterController.reset('Connect')
  }
}

export async function connectOathWallet(
  config: Config,
  candidate: Connector | CreateConnectorFn,
): Promise<ConnectReturnType<Config, Connector, false>> {
  // Match Wagmi connect's factory setup so we can clear a provider session
  // restored from storage before connecting (even when Wagmi is disconnected).
  const connector =
    typeof candidate === 'function'
      ? config._internal.connectors.setup(candidate)
      : candidate
  const provider = await connector.getProvider()
  if (
    provider &&
    typeof provider === 'object' &&
    'session' in provider &&
    provider.session
  ) {
    await connector.disconnect()
  }
  // Match EthereumProvider 2.21.10's AppKit 1.8.1. Loading another controller
  // version would manipulate a different modal singleton.
  const controllers = await import('@reown/appkit-controllers')
  const dispose = presentOathWallet(controllers)
  try {
    return await connect(config, { connector })
  } finally {
    dispose()
  }
}

// Serialize manual selections, including generic WalletConnect, so another
// selection cannot inherit Oath's temporary modal view during pairing.
let queue: Promise<unknown> = Promise.resolve()
export function queueEvmWalletConnection<T>(
  operation: () => Promise<T>,
): Promise<T> {
  const result = queue.then(operation)
  queue = result.catch(() => undefined)
  return result
}
