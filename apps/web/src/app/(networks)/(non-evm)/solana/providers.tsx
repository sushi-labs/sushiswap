'use client'

import { AppProvider as SvmConnectorProvider } from '@solana/connector/react'
import { WalletProvider } from 'src/lib/wallet'
import { SidebarProvider } from '../../_ui/sidebar'
import { connectorConfig } from './_common/config/connector'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SvmConnectorProvider connectorConfig={connectorConfig}>
      <WalletProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </WalletProvider>
    </SvmConnectorProvider>
  )
}
