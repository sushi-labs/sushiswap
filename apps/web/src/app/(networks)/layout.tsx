import { BaseProviders } from '@sushiswap/ui'
import { headers } from 'next/headers'
import { SwappedProvider } from 'src/lib/swapped/components/swapped-provider'
import { WalletProvider } from 'src/lib/wallet'
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
        <WagmiProvider cookie={cookie}>
          <WalletProvider>
            <SwappedProvider defaultAsset="ETH">{children}</SwappedProvider>
          </WalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </BaseProviders>
  )
}
