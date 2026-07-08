'use client'

import { BaseProviders } from '@sushiswap/ui'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { WalletProvider } from 'src/lib/wallet'
import { PrivyProvider } from 'src/providers/privy-provider'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { SidebarProvider } from '../(networks)/_ui/sidebar'
import { WagmiProvider } from '../../providers/wagmi-provider'

export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <PrivyProvider>
        <WagmiProvider cookie={cookie}>
          <WalletProvider>
            <PriceProvider>
              <SidebarProvider>
                <OnramperProvider>{children}</OnramperProvider>
              </SidebarProvider>
            </PriceProvider>
          </WalletProvider>
        </WagmiProvider>
      </PrivyProvider>
    </BaseProviders>
  )
}
