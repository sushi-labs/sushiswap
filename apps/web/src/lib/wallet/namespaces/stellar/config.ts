export {
  STELLAR_ACTIVE_ADDRESS_STORAGE_KEY,
  STELLAR_SELECTED_MODULE_STORAGE_KEY,
  StellarAdapterId,
  getStellarModuleId,
  getStellarWalletId,
} from './adapter'

type StellarWalletKit =
  typeof import('@creit.tech/stellar-wallets-kit').StellarWalletsKit

let kitPromise: Promise<StellarWalletKit> | undefined

/**
 * Loads and initializes Stellar's wallet kit on first use.
 *
 * The kit pulls every wallet module it supports plus `@stellar/stellar-sdk`,
 * about 1.3 MB of JavaScript. Importing it at module scope put all of that in
 * the first load of every route under `(networks)` — including the EVM and
 * Solana pages, which never touch Stellar — because a static import anywhere
 * in a route's client graph places the chunk in that route's entry group.
 *
 * Callers already reach the kit from event handlers and mutations, so awaiting
 * it here costs nothing until someone actually uses a Stellar wallet.
 */
export function getStellarWalletKit(): Promise<StellarWalletKit> {
  kitPromise ??= initStellarWalletKit().catch((error: unknown) => {
    // Never cache a failed load: a retry should be able to fetch the chunk
    // again rather than replay the rejection forever.
    kitPromise = undefined
    throw error
  })
  return kitPromise
}

async function initStellarWalletKit(): Promise<StellarWalletKit> {
  if (typeof window === 'undefined') {
    throw new Error('The Stellar wallet kit is only available in the browser')
  }

  const [
    { Networks, StellarWalletsKit },
    { HotWalletModule },
    { defaultModules },
    { WalletConnectModule, WalletConnectTargetChain },
  ] = await Promise.all([
    import('@creit.tech/stellar-wallets-kit'),
    import('@creit.tech/stellar-wallets-kit/modules/hotwallet'),
    import('@creit.tech/stellar-wallets-kit/modules/utils'),
    import('@creit.tech/stellar-wallets-kit/modules/wallet-connect'),
  ])

  StellarWalletsKit.init({
    network: Networks.PUBLIC,
    modules: [
      ...defaultModules(),
      new HotWalletModule(),
      new WalletConnectModule({
        projectId: '04fe42b39cc40b3dd24d3a5ede232dfa',
        metadata: {
          name: 'Sushi',
          description: 'Sushi - Stellar',
          url: 'https://www.sushi.com',
          icons: [
            'https://assets.coingecko.com/coins/images/12271/standard/512x512_Logo_no_chop.png?1696512101',
          ],
        },
        allowedChains: [WalletConnectTargetChain.PUBLIC],
      }),
    ],
  })

  return StellarWalletsKit
}
