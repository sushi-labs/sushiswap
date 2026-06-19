import { BaseProviders } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { WalletProvider } from 'src/lib/wallet'
import { PrivyProvider } from 'src/providers/privy-provider'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import { WagmiProvider } from 'src/providers/wagmi-provider'
import { NewAppVersionDialog } from '../_common/app-version/new-app-version-dialog'

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const cookie = (await headers()).get('cookie')
  return (
    <BaseProviders>
      <QueryClientProvider>
        <NewAppVersionDialog />
        <PrivyProvider>
          <WalletProvider>
            <WagmiProvider cookie={cookie}>
              <OnramperProvider>{children}</OnramperProvider>
            </WagmiProvider>
          </WalletProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </BaseProviders>
  )
}
