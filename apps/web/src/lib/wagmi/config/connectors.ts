import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

export const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet, trustWallet],
    },
    {
      groupName: 'Others',
      wallets: [injectedWallet, walletConnectWallet, argentWallet, safeWallet],
    },
  ],
  {
    appName: 'Sushi',
    projectId: '3f44629277b155ef0caebf3dc705c4ba',
  },
)
