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
    installUrl: string
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
      if (walletAdapterName !== 'WalletConnect') {
        setIsConnecting(true)
      }
      try {
        const accountInfo = await client.connect(walletAdapterName)
        setActiveAccount(accountInfo)
        setCurrentWallet(walletAdapterName)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    },
    [client],
  )

  const handleDisconnect = useCallback(async () => {
    if (currentWallet) {
      await client.disconnect(currentWallet)
      setActiveAccount(null)
      setCurrentWallet(null)
      setIsConnected(false)
    }
  }, [client, currentWallet])

  const ADAPTER_ICONS = {
    Ecko: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAxMiAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTk0ODcgMTUuNjA5Mkw4LjA1Nzk1IDE0LjYzOTRMNS45OTAwNCAxMi41MDAzTDguMDU3OTUgMTAuMzYwOEw4Ljk5NDg3IDkuMzkxODNMOS45MzIwNyAxMC4zNjA4TDEyIDEyLjUwMDNMOS45MzIwNyAxNC42Mzk0TDguOTk0ODcgMTUuNjA5MlpNOC45OTQ4NyAxOC42MDcxVjI1TDAgMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyAxOC42MDcxWk0wIDkuMzA0OTdWMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyA2LjM5NDE3VjBMMCA5LjMwNDk3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIwNTFfMTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjA1MV8xNiIgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRkQzMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkYwMEI4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
    WalletConnect:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjEuNDM4NTQsOTQuMDAzOGM0OC45MTEyMywtNDcuODg4MTcgMTI4LjIxMTk5LC00Ny44ODgxNyAxNzcuMTIzMjEsMGw1Ljg4NjU1LDUuNzYzNDJjMi40NDU1NiwyLjM5NDQxIDIuNDQ1NTYsNi4yNzY1MSAwLDguNjcwOTJsLTIwLjEzNjcsMTkuNzE1NWMtMS4yMjI3OCwxLjE5NzIxIC0zLjIwNTMsMS4xOTcyMSAtNC40MjgwOCwwbC04LjEwMDU4LC03LjkzMTE1Yy0zNC4xMjE2OSwtMzMuNDA3OTggLTg5LjQ0Mzg5LC0zMy40MDc5OCAtMTIzLjU2NTU4LDBsLTguNjc1MDYsOC40OTM2MWMtMS4yMjI3OCwxLjE5NzIgLTMuMjA1MywxLjE5NzIgLTQuNDI4MDgsMGwtMjAuMTM2NjksLTE5LjcxNTVjLTIuNDQ1NTYsLTIuMzk0NDEgLTIuNDQ1NTYsLTYuMjc2NTIgMCwtOC42NzA5Mmw2LjQ2MTAxLC02LjMyNTg4em0yMTguNzY3OCw0MC43NzM3NWwxNy45MjE3LDE3LjU0Njg5YzIuNDQ1NTQsMi4zOTQ0IDIuNDQ1NTYsNi4yNzY0OCAwLjAwMDAzLDguNjcwODlsLTgwLjgxMDE3LDc5LjEyMTE0Yy0yLjQ0NTU1LDIuMzk0NDIgLTYuNDEwNTksMi4zOTQ0NSAtOC44NTYxNiwwLjAwMDA2Yy0wLjAwMDAxLC0wLjAwMDAxIC0wLjAwMDAzLC0wLjAwMDAyIC0wLjAwMDA0LC0wLjAwMDAzbC01Ny4zNTQxNCwtNTYuMTU0NThjLTAuNjExMzksLTAuNTk4NiAtMS42MDI2NSwtMC41OTg2IC0yLjIxNDA0LDBjMCwwLjAwMDAxIC0wLjAwMDAxLDAuMDAwMDEgLTAuMDAwMDEsMC4wMDAwMmwtNTcuMzUyOTIsNTYuMTU0NTNjLTIuNDQ1NTQsMi4zOTQ0MyAtNi40MTA1OCwyLjM5NDQ3IC04Ljg1NjE2LDAuMDAwMDhjLTAuMDAwMDIsLTAuMDAwMDEgLTAuMDAwMDMsLTAuMDAwMDIgLTAuMDAwMDUsLTAuMDAwMDRsLTgwLjgxMjQyLC03OS4xMjIxOWMtMi40NDU1NiwtMi4zOTQ0IC0yLjQ0NTU2LC02LjI3NjUxIDAsLTguNjcwOTFsMTcuOTIxNzMsLTE3LjU0Njg3YzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMGw1Ny4zNTQ5OCw1Ni4xNTUzNWMwLjYxMTM5LDAuNTk4NjEgMS42MDI2NSwwLjU5ODYxIDIuMjE0MDQsMGMwLjAwMDAxLDAgMC4wMDAwMiwtMC4wMDAwMSAwLjAwMDAzLC0wLjAwMDAybDU3LjM1MjEsLTU2LjE1NTMzYzIuNDQ1NSwtMi4zOTQ0NyA2LjQxMDU0LC0yLjM5NDU2IDguODU2MTYsLTAuMDAwMmMwLjAwMDAzLDAuMDAwMDMgMC4wMDAwNywwLjAwMDA3IDAuMDAwMSwwLjAwMDFsNTcuMzU0OSw1Ni4xNTU0M2MwLjYxMTM5LDAuNTk4NiAxLjYwMjY1LDAuNTk4NiAyLjIxNDA0LDBsNTcuMzUzOTgsLTU2LjE1NDMyYzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMHoiIGZpbGw9IiMzYjk5ZmMiIGlkPSJzdmdfMSIvPjwvc3ZnPg==',
  }

  const ADAPTER_INSTALL_URLS = {
    Ecko: 'https://wallet.ecko.finance/',
  }

  const walletAdapters = client.getProviders().map((adapter) => ({
    name: adapter.name,
    detected: adapter.detected,
    imageURI: ADAPTER_ICONS[adapter.name as keyof typeof ADAPTER_ICONS] || '',
    installUrl:
      ADAPTER_INSTALL_URLS[adapter.name as keyof typeof ADAPTER_INSTALL_URLS] ||
      '',
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
