'use client'

import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { SidebarProvider } from '../../_ui/sidebar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PriceProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </PriceProvider>
  )
}
