'use client'

import { EckoAdapter, detectEckoProvider } from '@kadena/wallet-adapter-ecko'
import {
  SnapAdapter,
  detectSnapProvider,
} from '@kadena/wallet-adapter-metamask-snap'
import { KadenaWalletProvider as KadenaWalletProviderReact } from '@kadena/wallet-adapter-react'
import {
  WalletConnectAdapter,
  detectWalletConnectProvider,
} from '@kadena/wallet-adapter-walletconnect'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BalanceProvider } from '~evm/_common/ui/balance-provider/balance-provider'
import { PriceProvider } from '~evm/_common/ui/price-provider/price-provider/price-provider'
import { KADENA_NETWORK_ID } from './_common/constants/network'
import { KadenaWalletProvider } from './kadena-wallet-provider'

//@dev will remove later, for testing purposes only
const TEST_ID = '5329e5621bb8e903c0de8ad458cc8934'

type AdapterContextType = {
  refreshSnapAdapter: () => Promise<void>
}

const KadenaAdapaterContext = createContext<AdapterContextType | undefined>(
  undefined,
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [snapAdapter, setSnapAdapter] = useState<SnapAdapter | null>(null)
  const [eckoApadter, setEckoAdpater] = useState<EckoAdapter | null>(null)
  const [walletConnectAdapter, setWalletConnectAdapter] =
    useState<WalletConnectAdapter | null>(null)

  useEffect(() => {
    async function initSnap() {
      const snapProvider = await detectSnapProvider({ silent: true })
      if (snapProvider) {
        const adapter = new SnapAdapter({
          provider: snapProvider,
          networkId: KADENA_NETWORK_ID,
        })
        setSnapAdapter(adapter)
      }
    }
    async function initEcko() {
      const eckoAdapter = await detectEckoProvider({ silent: true })
      if (eckoAdapter) {
        const adapter = new EckoAdapter({
          provider: eckoAdapter,
          networkId: KADENA_NETWORK_ID,
        })
        setEckoAdpater(adapter)
      }
    }
    async function initWalletConnect() {
      const wcAdapter = await detectWalletConnectProvider({ silent: true })
      if (wcAdapter) {
        const adapter = new WalletConnectAdapter({
          provider: wcAdapter,
          networkId: KADENA_NETWORK_ID,
          projectId:
            process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? TEST_ID,
        })
        setWalletConnectAdapter(adapter)
      }
    }
    initSnap()
    initEcko()
    initWalletConnect()
  }, [])

  const refreshSnapAdapter = async () => {
    const snapProvider = await detectSnapProvider({ silent: true })
    if (snapProvider) {
      const _adapter = new SnapAdapter({
        provider: snapProvider,
        networkId: KADENA_NETWORK_ID,
      })
      setSnapAdapter(_adapter)
    }
  }
  const adapters = useMemo(() => {
    return [
      ...(eckoApadter ? [eckoApadter] : []),
      ...(snapAdapter ? [snapAdapter] : []),
      ...(walletConnectAdapter ? [walletConnectAdapter] : []),
    ]
  }, [eckoApadter, snapAdapter, walletConnectAdapter])

  return (
    <KadenaAdapaterContext.Provider value={{ refreshSnapAdapter }}>
      <KadenaWalletProviderReact defaultAdapterName="Snap" adapters={adapters}>
        <KadenaWalletProvider>
          <BalanceProvider>
            <PriceProvider>{children}</PriceProvider>
          </BalanceProvider>
        </KadenaWalletProvider>
      </KadenaWalletProviderReact>
    </KadenaAdapaterContext.Provider>
  )
}

export const useKadenaAdapterContext = (): AdapterContextType => {
  const context = useContext(KadenaAdapaterContext)

  if (!context) {
    throw new Error('useKadena must be used within a KadenaAdapaterContext')
  }

  return context
}
