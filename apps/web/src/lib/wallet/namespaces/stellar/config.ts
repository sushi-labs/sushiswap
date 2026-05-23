import {
  type ISupportedWallet,
  Networks,
  StellarWalletsKit,
} from '@creit.tech/stellar-wallets-kit'
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils'
import {
  WalletConnectModule,
  WalletConnectTargetChain,
} from '@creit.tech/stellar-wallets-kit/modules/wallet-connect'

export enum StellarAdapterId {
  Standard = 'stellar-standard',
}

const STELLAR_WALLET_ID_PREFIX = 'stellar:'

export function getStellarWalletId(moduleId: string) {
  return `${STELLAR_WALLET_ID_PREFIX}${moduleId.toLowerCase()}`
}

export function getStellarModuleId(walletId: string) {
  if (!walletId.startsWith(STELLAR_WALLET_ID_PREFIX)) return undefined

  const moduleId = walletId.slice(STELLAR_WALLET_ID_PREFIX.length)
  return moduleId || undefined
}

StellarWalletsKit.init({
  network: Networks.PUBLIC,
  modules: [
    ...defaultModules(),
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

export const stellarWalletKit = StellarWalletsKit
