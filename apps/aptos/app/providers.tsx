'use client'

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import { PontemWallet } from '@pontem/wallet-adapter-plugin'
import { FewchaWallet } from 'fewcha-plugin-wallet-adapter'
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter'
import { RiseWallet } from '@rise-wallet/wallet-adapter'
import { ThemeProvider } from '@sushiswap/ui'
// import { BloctoWallet } from '@blocto/aptos-wallet-adapter-plugin'
import { NetworkName, Wallet } from '@aptos-labs/wallet-adapter-core'
// import { SafePalWalletAdapter } from '@aptstats/safepal-wallet-extension'
const wallets = [
  new PetraWallet(),
  new PontemWallet(),
  new FewchaWallet(),
  new MartianWallet(),
  new RiseWallet(),
  // new BloctoWallet({ network: NetworkName.Mainnet, bloctoAppId: 'abc' }),
  // new SafePalWalletAdapter(),
]

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <ThemeProvider>{children}</ThemeProvider>
      </AptosWalletAdapterProvider>
    </>
  )
}
