'use client'

import { BaseProviders } from '@sushiswap/ui'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { WalletProvider } from 'src/providers/wallet-provider'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { SidebarProvider } from '../(networks)/_ui/sidebar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseProviders>
      <WalletProvider>
        <PriceProvider>
          <SidebarProvider>
            <OnramperProvider>{children}</OnramperProvider>
          </SidebarProvider>
        </PriceProvider>
      </WalletProvider>
    </BaseProviders>
  )
}
