'use client'

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter'
import { MSafeWalletAdapter } from '@msafe/aptos-wallet-adapter'
import { PontemWallet } from '@pontem/wallet-adapter-plugin'
import { RiseWallet } from '@rise-wallet/wallet-adapter'
import { BaseProviders, OnramperProvider } from '@sushiswap/ui'
import { FewchaWallet } from 'fewcha-plugin-wallet-adapter'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import { WagmiProvider } from 'src/providers/wagmi-provider'
import { Modal } from '~aptos/_common/components/Modal/Modal'

const wallets = [
  new PetraWallet(),
  new PontemWallet(),
  new FewchaWallet(),
  new MartianWallet(),
  new RiseWallet(),
  new MSafeWalletAdapter(),
]

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnramperProvider>
      <QueryClientProvider>
        <WagmiProvider>
          <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
            <BaseProviders>
              <Modal.Provider>{children}</Modal.Provider>
            </BaseProviders>
          </AptosWalletAdapterProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </OnramperProvider>
  )
}
