'use client'

import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import {
  type StellarAddress,
  StellarChainId,
  isStellarAccountAddress,
} from 'sushi/stellar'
import type { WalletNamespaceContext } from '../../types'
import {
  STELLAR_ACTIVE_ADDRESS_STORAGE_KEY,
  STELLAR_SELECTED_MODULE_STORAGE_KEY,
  StellarAdapterId,
  getStellarModuleId,
  getStellarWalletId,
} from '../adapter'
import type { StellarWalletConnection } from '../runtime'

type StellarWalletRuntime = typeof import('../runtime')

let stellarWalletRuntimePromise: Promise<StellarWalletRuntime> | undefined

function loadStellarWalletRuntime(): Promise<StellarWalletRuntime> {
  stellarWalletRuntimePromise ??= import('../runtime')
  return stellarWalletRuntimePromise
}

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
  const initialConnection = getInitialConnection()
  const [account, setAccount] = useState<StellarAddress | undefined>(
    initialConnection.account,
  )
  const [wallet, setWallet] = useState<Wallet | null>(initialConnection.wallet)
  const [isHydrated, setIsHydrated] = useState(initialConnection.isHydrated)
  const unsubscribeRuntimeRef = useRef<(() => void) | undefined>(undefined)

  const syncConnection = useCallback(async () => {
    const { disconnectStellarWallet, getStellarWalletConnection } =
      await loadStellarWalletRuntime()

    try {
      const connection = await getStellarWalletConnection()
      if (!connection) {
        setAccount(undefined)
        setWallet(null)
        return
      }

      setAccount(connection.account)
      setWallet(toWallet(connection.moduleId, connection.wallet))
    } catch {
      setAccount(undefined)
      setWallet(null)
      await disconnectStellarWallet().catch(() => undefined)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const ensureRuntimeSubscription = useCallback(async () => {
    if (unsubscribeRuntimeRef.current) return

    const { subscribeToStellarWallet } = await loadStellarWalletRuntime()
    if (unsubscribeRuntimeRef.current) return

    const unsubscribe = subscribeToStellarWallet({
      onStateUpdated: () => {
        void syncConnection()
      },
      onDisconnected: () => {
        setAccount(undefined)
        setWallet(null)
        setIsHydrated(true)
      },
    })

    unsubscribeRuntimeRef.current = () => {
      unsubscribe()
      unsubscribeRuntimeRef.current = undefined
    }
  }, [syncConnection])

  useEffect(() => {
    if (!hasPersistedStellarConnection()) return

    let cancelled = false

    async function restoreConnection(): Promise<void> {
      await loadStellarWalletRuntime()
      if (cancelled) return

      await ensureRuntimeSubscription()
      await syncConnection()
    }

    void restoreConnection()

    return () => {
      cancelled = true
    }
  }, [ensureRuntimeSubscription, syncConnection])

  useEffect(() => {
    return () => unsubscribeRuntimeRef.current?.()
  }, [])

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: StellarAddress) => void) => {
      const moduleId = getStellarModuleId(wallet.id)
      if (!moduleId) throw new Error('Invalid wallet id')

      const { connectStellarWallet } = await loadStellarWalletRuntime()
      await ensureRuntimeSubscription()
      setWallet(wallet)
      const address = await connectStellarWallet(moduleId)
      setAccount(address)
      setIsHydrated(true)
      onSuccess?.(address)
    },
    [ensureRuntimeSubscription],
  )

  const disconnect = useCallback(async () => {
    const { disconnectStellarWallet } = await loadStellarWalletRuntime()
    await disconnectStellarWallet()
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
  const moduleId = globalThis.localStorage?.getItem(
    STELLAR_SELECTED_MODULE_STORAGE_KEY,
  )
  const storedAccount = globalThis.localStorage?.getItem(
    STELLAR_ACTIVE_ADDRESS_STORAGE_KEY,
  )
  const account =
    storedAccount && isStellarAccountAddress(storedAccount)
      ? storedAccount
      : undefined

  if (moduleId && account) {
    return {
      account,
      wallet: toWallet(moduleId),
      isHydrated: true,
    }
  }

  return {
    account: undefined,
    wallet: null,
    isHydrated: !moduleId,
  }
}

function hasPersistedStellarConnection(): boolean {
  return Boolean(
    globalThis.localStorage?.getItem(STELLAR_SELECTED_MODULE_STORAGE_KEY),
  )
}

function toWallet(
  moduleId: string,
  supportedWallet?: StellarWalletConnection['wallet'],
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
