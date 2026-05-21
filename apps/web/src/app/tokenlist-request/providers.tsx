'use client'

import { BaseProviders } from '@sushiswap/ui'
import { SwappedProvider } from 'src/lib/swapped/components/swapped-provider'
import { WalletProvider } from 'src/lib/wallet'
import { SidebarProvider } from '../(networks)/_ui/sidebar'
import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiProvider } from '../../providers/wagmi-provider'
export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <QueryClientProvider>
        <WalletProvider>
          <SidebarProvider>
            <WagmiProvider cookie={cookie}>
              <SwappedProvider defaultAsset="ETH">{children}</SwappedProvider>
            </WagmiProvider>
          </SidebarProvider>
        </WalletProvider>
      </QueryClientProvider>
    </BaseProviders>
  )
}
