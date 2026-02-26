import type { Metadata } from 'next'
import type React from 'react'
import { WalletProvider } from 'src/lib/wallet'
import { SidebarProvider } from '../../_ui/sidebar'
import { MigrateBanner } from './legacy-positions/migrate-banner'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Sushi 🍣',
    template: '%s | Sushi 🍣',
  },
  description:
    'A Decentralised Finance (DeFi) app with features such as swap, cross chain swap, streaming, vesting, and permissionless market making for liquidity providers.',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <Providers>
        <SidebarProvider>
          <div className="flex flex-col h-full w-full">
            <MigrateBanner />
            {children}
          </div>
        </SidebarProvider>
      </Providers>
    </WalletProvider>
  )
}
