'use client'

import { BaseProviders } from '@sushiswap/ui'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { WalletProvider } from 'src/lib/wallet'
import { SidebarProvider } from '../(networks)/_ui/sidebar'
import { WagmiProvider } from '../../providers/wagmi-provider'

export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <WalletProvider>
        <SidebarProvider>
          <WagmiProvider cookie={cookie}>
            <OnramperProvider>{children}</OnramperProvider>
          </WagmiProvider>
        </SidebarProvider>
      </WalletProvider>
    </BaseProviders>
  )
}
