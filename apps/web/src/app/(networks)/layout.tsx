import { BaseProviders, OnramperProvider } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import { WagmiProvider } from 'src/providers/wagmi-provider'
import { NewAppVersionDialog } from '../_common/app-version/new-app-version-dialog'
import { SidebarProvider } from './_ui/sidebar'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const cookie = (await headers()).get('cookie')
  return (
    <BaseProviders>
      <OnramperProvider>
        <QueryClientProvider>
          <NewAppVersionDialog />
          <WagmiProvider cookie={cookie}>
            <SidebarProvider>{children}</SidebarProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </OnramperProvider>
    </BaseProviders>
  )
}
