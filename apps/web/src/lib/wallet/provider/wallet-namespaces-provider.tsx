'use client'

import dynamic from 'next/dynamic'
import { ENABLED_WALLET_NAMESPACES } from '../config'
import type { WalletNamespace } from '../types'

const WALLET_NAMESPACE_PROVIDERS: Record<
  WalletNamespace,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  evm: dynamic(() => import('../namespaces/evm/provider/evm-wallet-provider'), {
    ssr: false,
  }),

  svm: dynamic(() => import('../namespaces/svm/provider/svm-wallet-provider'), {
    ssr: false,
  }),
  stellar: dynamic(
    () => import('../namespaces/stellar/provider/stellar-wallet-provider'),
    {
      ssr: false,
    },
  ),
}

const providers = ENABLED_WALLET_NAMESPACES.map(
  (namespace) => WALLET_NAMESPACE_PROVIDERS[namespace],
).filter(Boolean)

export function WalletNamespacesProviders({
  children,
}: { children: React.ReactNode }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider key={Provider.name}>{acc}</Provider>,
    children,
  )
}
