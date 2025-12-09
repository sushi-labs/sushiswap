import { type AppKitNetwork, mainnet } from '@reown/appkit/networks'
import { type AppKit, createAppKit as _createAppKit } from '@reown/appkit/react'
import { getWagmiAdapter } from '.'

const metadata = {
  name: 'SushiSwap',
  description:
    'The ultimate multi-chain DEX + Aggregator that lets you SWAP ANYTHING.',
  url: 'https://sushi.com',
  icons: ['https://www.sushi.com/icon.png'],
}

export const projectId = '3f44629277b155ef0caebf3dc705c4ba'

const createAppKit = () => {
  return _createAppKit({
    adapters: [getWagmiAdapter()],
    projectId,
    networks: getWagmiAdapter().networks as [AppKitNetwork, ...AppKitNetwork[]],
    coinbasePreference: 'all',
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', //metamask
      'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', //coinbase
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', //trust
    ],
    defaultNetwork: mainnet,
    metadata: metadata,
    termsConditionsUrl: 'https://www.sushi.com/legal/terms-of-service',
    privacyPolicyUrl: 'https://www.sushi.com/legal/privacy-policy',
  })
}

let appKitSingleton: AppKit | undefined = undefined
export const getAppKit = () => {
  if (typeof window === 'undefined') {
    return createAppKit()
  }

  if (!appKitSingleton) {
    appKitSingleton = createAppKit()
  }

  return appKitSingleton
}
