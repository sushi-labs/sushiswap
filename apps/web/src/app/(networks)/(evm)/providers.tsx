'use client'
import { SidebarProvider } from '../_ui/sidebar'
import { BalanceProvider } from './_common/ui/balance-provider/balance-provider'
import { PriceProvider } from './_common/ui/price-provider/price-provider/price-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PriceProvider>
      <SidebarProvider>
        <BalanceProvider>{children}</BalanceProvider>
      </SidebarProvider>
    </PriceProvider>
  )
}
