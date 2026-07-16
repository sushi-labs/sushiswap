'use client'

import {
  type ISupportedWallet,
  KitEventType,
} from '@creit.tech/stellar-wallets-kit'
import {
  activeAddress,
  selectedModuleId,
} from '@creit.tech/stellar-wallets-kit/state'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useMarkWalletNamespaceRestored } from 'src/lib/wallet/provider'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { type StellarAddress, StellarChainId } from 'sushi/stellar'
import type { WalletNamespaceContext } from '../../types'
import {
  StellarAdapterId,
  getStellarModuleId,
  getStellarWalletId,
  stellarWalletKit,
} from '../config'

const StellarWalletContext = createContext<WalletNamespaceContext | null>(null)

export function useStellarWalletContext() {
  const ctx = useContext(StellarWalletContext)
  if (!ctx)
    throw new Error(
      'useStellarWalletContext must be used within <StellarWalletProvider>',
    )
  return ctx
}

export default function StellarWalletProvider({
  children,
}: { children: React.ReactNode }) {
  return <_StellarWalletProvider>{children}</_StellarWalletProvider>
}

function _StellarWalletProvider({ children }: { children: React.ReactNode }) {
  const markNamespaceRestored = useMarkWalletNamespaceRestored()
  const initialConnection = getInitialConnection()
  const [account, setAccount] = useState<StellarAddress | undefined>(
    initialConnection.account,
  )
  const [wallet, setWallet] = useState<Wallet | null>(initialConnection.wallet)
  const [isHydrated, setIsHydrated] = useState(initialConnection.isHydrated)

  const syncConnection = useCallback(async () => {
    const moduleId = selectedModuleId.value

    if (!moduleId) {
      setAccount(undefined)
      setWallet(null)
      setIsHydrated(true)
      return
    }

    try {
      const [{ address }, supportedWallets] = await Promise.all([
        stellarWalletKit.getAddress(),
        stellarWalletKit.refreshSupportedWallets(),
      ])

      const supportedWallet = supportedWallets.find(
        (wallet) => wallet.id === moduleId,
      )

      setAccount(address as StellarAddress)
      setWallet(toWallet(moduleId, supportedWallet))
    } catch {
      setAccount(undefined)
      setWallet(null)
      await stellarWalletKit.disconnect().catch(() => undefined)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    syncConnection()

    const unsubscribeStateUpdated = stellarWalletKit.on(
      KitEventType.STATE_UPDATED,
      () => {
        syncConnection()
      },
    )
    const unsubscribeDisconnected = stellarWalletKit.on(
      KitEventType.DISCONNECT,
      () => {
        setAccount(undefined)
        setWallet(null)
        setIsHydrated(true)
      },
    )

    return () => {
      unsubscribeStateUpdated()
      unsubscribeDisconnected()
    }
  }, [syncConnection])

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: StellarAddress) => void) => {
      const moduleId = getStellarModuleId(wallet.id)
      if (!moduleId) throw new Error('Invalid wallet id')
      stellarWalletKit.setWallet(moduleId)
      setWallet(wallet)
      const address = (await stellarWalletKit.fetchAddress())
        .address as StellarAddress
      setAccount(address)
      setIsHydrated(true)
      onSuccess?.(address)
    },
    [],
  )

  const disconnect = useCallback(async () => {
    await stellarWalletKit.disconnect()
    setAccount(undefined)
    setWallet(null)
  }, [])

  const value = useMemo(
    () => ({
      isConnected: Boolean(account),
      account,
      connect,
      disconnect,
    }),
    [account, connect, disconnect],
  )

  useLayoutEffect(() => {
    if (!isHydrated) return

    if (!account || !wallet) {
      clearWalletConnections('stellar')
      return
    }
    const _wallet = wallet

    addWalletConnection({
      chainId: StellarChainId.STELLAR,
      id: _wallet.id,
      name: _wallet.name ?? '',
      namespace: 'stellar',
      account: account,
      icon: _wallet.icon ?? undefined,
    })
  }, [account, isHydrated, wallet])

  useLayoutEffect(() => {
    if (isHydrated) markNamespaceRestored('stellar')
  }, [isHydrated, markNamespaceRestored])

  return (
    <StellarWalletContext.Provider value={value}>
      {children}
    </StellarWalletContext.Provider>
  )
}

function getInitialConnection(): {
  account: StellarAddress | undefined
  wallet: Wallet | null
  isHydrated: boolean
} {
  const moduleId = selectedModuleId.value
  const account = activeAddress.value as StellarAddress | undefined

  if (!moduleId || !account) {
    return {
      account: undefined,
      wallet: null,
      isHydrated: !moduleId,
    }
  }

  return {
    account,
    wallet: toWallet(moduleId),
    isHydrated: true,
  }
}

function toWallet(
  moduleId: string,
  supportedWallet?: ISupportedWallet,
): Wallet {
  return {
    id: getStellarWalletId(moduleId),
    namespace: 'stellar',
    name: supportedWallet?.name ?? moduleId,
    icon: supportedWallet?.icon ?? '',
    adapterId: StellarAdapterId.Standard,
    url: supportedWallet?.url,
  }
}
