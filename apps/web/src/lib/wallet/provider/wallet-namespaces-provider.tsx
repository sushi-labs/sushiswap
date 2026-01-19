'use client'

import dynamic from 'next/dynamic'

const EvmWalletProvider = dynamic(
  () =>
    import('../namespaces/evm/provider/evm-wallet-provider').then(
      (m) => m.EvmWalletProvider,
    ),
  { ssr: false },
)

const SvmWalletProvider = dynamic(
  () =>
    import('../namespaces/svm/provider/svm-wallet-provider').then(
      (m) => m.SvmWalletProvider,
    ),
  { ssr: false },
)

export function WalletNamespacesProviders({
  children,
}: { children: React.ReactNode }) {
  const providers = [EvmWalletProvider, SvmWalletProvider]
  return providers.reduceRight(
    (acc, Provider) => <Provider key={Provider.name}>{acc}</Provider>,
    children,
  )
}
