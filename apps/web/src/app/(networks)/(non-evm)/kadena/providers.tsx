'use client'

import { EckoAdapter, detectEckoProvider } from '@kadena/wallet-adapter-ecko'
import {
  SnapAdapter,
  detectSnapProvider,
} from '@kadena/wallet-adapter-metamask-snap'
import { KadenaWalletProvider as KadenaWalletProviderReact } from '@kadena/wallet-adapter-react'
import { createWalletConnectAdapter } from '@kadena/wallet-adapter-walletconnect'
import { useEffect, useMemo, useState } from 'react'
import { KadenaWalletProvider } from './kadena-wallet-provider'

//@dev will remove later, for testing purposes only
const TEST_ID = '5329e5621bb8e903c0de8ad458cc8934'

export function Providers({ children }: { children: React.ReactNode }) {
  const [snapAdapter, setSnapAdapter] = useState<SnapAdapter | null>(null)
  const [eckoApadter, setEckoAdpater] = useState<EckoAdapter | null>(null)

  useEffect(() => {
    async function initSnap() {
      const snapProvider = await detectSnapProvider({ silent: true })
      if (snapProvider) {
        const adapter = new SnapAdapter({
          provider: snapProvider,
          networkId: 'mainnet01',
        })
        setSnapAdapter(adapter)
      }
    }
    async function initEcko() {
      const eckoAdapter = await detectEckoProvider({ silent: true })
      if (eckoAdapter) {
        const adapter = new EckoAdapter({
          provider: eckoAdapter,
          networkId: 'mainnet01',
        })
        setEckoAdpater(adapter)
      }
    }
    initSnap()
    initEcko()
  }, [])

  const adapters = useMemo(() => {
    return [
      ...(snapAdapter ? [snapAdapter] : []),
      ...(eckoApadter ? [eckoApadter] : []),
      createWalletConnectAdapter({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? TEST_ID,
      }),
    ]
  }, [eckoApadter, snapAdapter])
  return (
    <KadenaWalletProviderReact adapters={adapters}>
      <KadenaWalletProvider>{children}</KadenaWalletProvider>
    </KadenaWalletProviderReact>
  )
}
