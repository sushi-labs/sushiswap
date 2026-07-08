'use client'

import { AppProvider as SvmConnectorProvider } from '@solana/connector/react'
import { WalletProvider } from 'src/lib/wallet'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { SidebarProvider } from '../../_ui/sidebar'
import { getConnectorConfig } from './_common/config/connector'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SvmConnectorProvider connectorConfig={getConnectorConfig()}>
      <WalletProvider>
        <PriceProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </PriceProvider>
      </WalletProvider>
    </SvmConnectorProvider>
  )
}
