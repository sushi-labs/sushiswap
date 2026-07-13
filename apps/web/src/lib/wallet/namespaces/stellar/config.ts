import { Networks, StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import { HotWalletModule } from '@creit.tech/stellar-wallets-kit/modules/hotwallet'
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils'
import {
  WalletConnectModule,
  WalletConnectTargetChain,
} from '@creit.tech/stellar-wallets-kit/modules/wallet-connect'
export {
  StellarAdapterId,
  getStellarModuleId,
  getStellarWalletId,
} from './adapter'

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

export const stellarWalletKit = StellarWalletsKit
