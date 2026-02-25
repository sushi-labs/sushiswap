import {
  type ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'
import {
  WalletConnectAllowedMethods,
  WalletConnectModule,
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module'

export enum StellarAdapterId {
  Standard = 'stellar-standard',
}

export const stellarWalletKit = new StellarWalletsKit({
  network: WalletNetwork.PUBLIC,
  modules: [
    ...allowAllModules(),
    new WalletConnectModule({
      projectId: '04fe42b39cc40b3dd24d3a5ede232dfa',
      url: 'https://www.sushi.com',
      name: 'Sushi',
      description: 'Sushi - Stellar',
      icons: [
        'https://assets.coingecko.com/coins/images/12271/standard/512x512_Logo_no_chop.png?1696512101',
      ],
      method: WalletConnectAllowedMethods.SIGN,
      network: WalletNetwork.PUBLIC,
    }),
  ],
})
