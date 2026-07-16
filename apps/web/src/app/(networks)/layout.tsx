import { BaseProviders } from '@sushiswap/ui'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { QueryClientProvider } from 'src/providers/query-client-provider'
import { WalletProvider } from 'src/providers/wallet-provider'
import { NewAppVersionDialog } from '../_common/app-version/new-app-version-dialog'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BaseProviders>
      <QueryClientProvider>
        <NewAppVersionDialog />
        <WalletProvider>
          <OnramperProvider>{children}</OnramperProvider>
        </WalletProvider>
      </QueryClientProvider>
    </BaseProviders>
  )
}
