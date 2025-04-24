import {
  type IKadenaWalletProviderProps,
  KadenaWalletProvider as KadenaWalletProviderReact,
  useKadenaWallet,
} from '@kadena/wallet-adapter-react'
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'

type WalletContextType = {
  currentWallet: string | null
  activeAccount: {
    accountName: string
    networkId: string
    contract: string
    guard: {
      keys: string[]
      pred: string
    }
    chainAccounts: string[]
  }
  handleConnect: (walletAdapterName: string) => Promise<void>
  handleDisconnect: () => Promise<void>
  setCurrentWallet: (wallet: string) => void
  adapters: {
    name: string
    detected: boolean
    imageURI: string
  }[]
  isConnected: boolean
  isConnecting: boolean
}

const KadenaWalletContext = createContext<WalletContextType | undefined>(
  undefined,
)

type KadenaWalletProviderProps = {
  children: ReactNode
}

export const KadenaWalletProvider = ({
  children,
}: KadenaWalletProviderProps) => {
  const { client } = useKadenaWallet()
  const [currentWallet, setCurrentWallet] = useState<string | null>(null)
  const [activeAccount, setActiveAccount] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = useCallback(
    async (walletAdapterName: string) => {
      if (!walletAdapterName) return
      setIsConnecting(true)
      const accountInfo = await client.connect(walletAdapterName)
      setActiveAccount(accountInfo)
      setCurrentWallet(walletAdapterName)
      setIsConnected(true)
      setIsConnecting(false)
      console.log('Connected account:', accountInfo)
    },
    [client],
  )

  const handleDisconnect = useCallback(async () => {
    if (currentWallet) {
      await client.disconnect(currentWallet)
      setActiveAccount(null)
      setCurrentWallet(null)
      setIsConnected(false)
      console.log('Disconnected wallet:', currentWallet)
    }
  }, [client, currentWallet])

  const ADAPTER_ICONS = {
    Ecko: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAxMiAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTk0ODcgMTUuNjA5Mkw4LjA1Nzk1IDE0LjYzOTRMNS45OTAwNCAxMi41MDAzTDguMDU3OTUgMTAuMzYwOEw4Ljk5NDg3IDkuMzkxODNMOS45MzIwNyAxMC4zNjA4TDEyIDEyLjUwMDNMOS45MzIwNyAxNC42Mzk0TDguOTk0ODcgMTUuNjA5MlpNOC45OTQ4NyAxOC42MDcxVjI1TDAgMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyAxOC42MDcxWk0wIDkuMzA0OTdWMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyA2LjM5NDE3VjBMMCA5LjMwNDk3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIwNTFfMTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjA1MV8xNiIgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRkQzMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkYwMEI4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  }

  const walletAdapters = client.getProviders().map((adapter) => ({
    name: adapter.name,
    detected: adapter.detected,
    imageURI: ADAPTER_ICONS[adapter.name as keyof typeof ADAPTER_ICONS] || '',
  }))

  const contextValue = useMemo(
    () => ({
      currentWallet,
      activeAccount,
      handleConnect,
      handleDisconnect,
      setCurrentWallet,
      adapters: walletAdapters,
      isConnected,
      isConnecting,
    }),
    [
      currentWallet,
      activeAccount,
      handleConnect,
      handleDisconnect,
      walletAdapters,
      isConnected,
      isConnecting,
    ],
  )

  return (
    <KadenaWalletContext.Provider value={contextValue}>
      {children}
    </KadenaWalletContext.Provider>
  )
}

export const useKadena = (): WalletContextType => {
  const context = useContext(KadenaWalletContext)
  if (!context)
    throw new Error('useKadena must be used within a KadenaWalletProvider')
  return context
}
