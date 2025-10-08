import { useKadenaWallet } from '@kadena/wallet-adapter-react'
import { useLocalStorage } from '@sushiswap/hooks'
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  useEffect,
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
  } | null
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
export const KADENA_WALLET_ADAPTER_ICONS = {
  Snap: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDcuODMgNDcwLjg2Ij48ZGVmcz48c3R5bGU+LmF7ZmlsbDojZTI3NjFiO3N0cm9rZTojZTI3NjFiO30uYSwuYiwuYywuZCwuZSwuZiwuZywuaCwuaSwuantzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5ie2ZpbGw6I2U0NzYxYjtzdHJva2U6I2U0NzYxYjt9LmN7ZmlsbDojZDdjMWIzO3N0cm9rZTojZDdjMWIzO30uZHtmaWxsOiMyMzM0NDc7c3Ryb2tlOiMyMzM0NDc7fS5le2ZpbGw6I2NkNjExNjtzdHJva2U6I2NkNjExNjt9LmZ7ZmlsbDojZTQ3NTFmO3N0cm9rZTojZTQ3NTFmO30uZ3tmaWxsOiNmNjg1MWI7c3Ryb2tlOiNmNjg1MWI7fS5oe2ZpbGw6I2MwYWQ5ZTtzdHJva2U6I2MwYWQ5ZTt9Lml7ZmlsbDojMTYxNjE2O3N0cm9rZTojMTYxNjE2O30uantmaWxsOiM3NjNkMTY7c3Ryb2tlOiM3NjNkMTY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5tZXRhbWFzazwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImEiIHBvaW50cz0iNDgyLjA5IDAuNSAyODQuMzIgMTQ3LjM4IDMyMC45IDYwLjcyIDQ4Mi4wOSAwLjUiLz48cG9seWdvbiBjbGFzcz0iYiIgcG9pbnRzPSIyNS41NCAwLjUgMjIxLjcyIDE0OC43NyAxODYuOTMgNjAuNzIgMjUuNTQgMC41Ii8+PHBvbHlnb24gY2xhc3M9ImIiIHBvaW50cz0iNDEwLjkzIDM0MC45NyAzNTguMjYgNDIxLjY3IDQ3MC45NiA0NTIuNjcgNTAzLjM2IDM0Mi43NiA0MTAuOTMgMzQwLjk3Ii8+PHBvbHlnb24gY2xhc3M9ImIiIHBvaW50cz0iNC42NyAzNDIuNzYgMzYuODcgNDUyLjY3IDE0OS41NyA0MjEuNjcgOTYuOSAzNDAuOTcgNC42NyAzNDIuNzYiLz48cG9seWdvbiBjbGFzcz0iYiIgcG9pbnRzPSIxNDMuMjEgMjA0LjYyIDExMS44IDI1Mi4xMyAyMjMuNyAyNTcuMSAyMTkuNzMgMTM2Ljg1IDE0My4yMSAyMDQuNjIiLz48cG9seWdvbiBjbGFzcz0iYiIgcG9pbnRzPSIzNjQuNDIgMjA0LjYyIDI4Ni45MSAxMzUuNDYgMjg0LjMyIDI1Ny4xIDM5Ni4wMyAyNTIuMTMgMzY0LjQyIDIwNC42MiIvPjxwb2x5Z29uIGNsYXNzPSJiIiBwb2ludHM9IjE0OS41NyA0MjEuNjcgMjE2Ljc1IDM4OC44NyAxNTguNzEgMzQzLjU1IDE0OS41NyA0MjEuNjciLz48cG9seWdvbiBjbGFzcz0iYiIgcG9pbnRzPSIyOTAuODggMzg4Ljg3IDM1OC4yNiA0MjEuNjcgMzQ4LjkyIDM0My41NSAyOTAuODggMzg4Ljg3Ii8+PHBvbHlnb24gY2xhc3M9ImMiIHBvaW50cz0iMzU4LjI2IDQyMS42NyAyOTAuODggMzg4Ljg3IDI5Ni4yNSA0MzIuOCAyOTUuNjUgNDUxLjI4IDM1OC4yNiA0MjEuNjciLz48cG9seWdvbiBjbGFzcz0iYyIgcG9pbnRzPSIxNDkuNTcgNDIxLjY3IDIxMi4xOCA0NTEuMjggMjExLjc4IDQzMi44IDIxNi43NSAzODguODcgMTQ5LjU3IDQyMS42NyIvPjxwb2x5Z29uIGNsYXNzPSJkIiBwb2ludHM9IjIxMy4xNyAzMTQuNTQgMTU3LjEyIDI5OC4wNCAxOTYuNjcgMjc5Ljk1IDIxMy4xNyAzMTQuNTQiLz48cG9seWdvbiBjbGFzcz0iZCIgcG9pbnRzPSIyOTQuNDYgMzE0LjU0IDMxMC45NiAyNzkuOTUgMzUwLjcxIDI5OC4wNCAyOTQuNDYgMzE0LjU0Ii8+PHBvbHlnb24gY2xhc3M9ImUiIHBvaW50cz0iMTQ5LjU3IDQyMS42NyAxNTkuMTEgMzQwLjk3IDk2LjkgMzQyLjc2IDE0OS41NyA0MjEuNjciLz48cG9seWdvbiBjbGFzcz0iZSIgcG9pbnRzPSIzNDguNzIgMzQwLjk3IDM1OC4yNiA0MjEuNjcgNDEwLjkzIDM0Mi43NiAzNDguNzIgMzQwLjk3Ii8+PHBvbHlnb24gY2xhc3M9ImUiIHBvaW50cz0iMzk2LjAzIDI1Mi4xMyAyODQuMzIgMjU3LjEgMjk0LjY2IDMxNC41NCAzMTEuMTYgMjc5Ljk1IDM1MC45MSAyOTguMDQgMzk2LjAzIDI1Mi4xMyIvPjxwb2x5Z29uIGNsYXNzPSJlIiBwb2ludHM9IjE1Ny4xMiAyOTguMDQgMTk2Ljg3IDI3OS45NSAyMTMuMTcgMzE0LjU0IDIyMy43IDI1Ny4xIDExMS44IDI1Mi4xMyAxNTcuMTIgMjk4LjA0Ii8+PHBvbHlnb24gY2xhc3M9ImYiIHBvaW50cz0iMTExLjggMjUyLjEzIDE1OC43MSAzNDMuNTUgMTU3LjEyIDI5OC4wNCAxMTEuOCAyNTIuMTMiLz48cG9seWdvbiBjbGFzcz0iZiIgcG9pbnRzPSIzNTAuOTEgMjk4LjA0IDM0OC45MiAzNDMuNTUgMzk2LjAzIDI1Mi4xMyAzNTAuOTEgMjk4LjA0Ii8+PHBvbHlnb24gY2xhc3M9ImYiIHBvaW50cz0iMjIzLjcgMjU3LjEgMjEzLjE3IDMxNC41NCAyMjYuMjkgMzgyLjMxIDIyOS4yNyAyOTMuMDcgMjIzLjcgMjU3LjEiLz48cG9seWdvbiBjbGFzcz0iZiIgcG9pbnRzPSIyODQuMzIgMjU3LjEgMjc4Ljk2IDI5Mi44NyAyODEuMzQgMzgyLjMxIDI5NC42NiAzMTQuNTQgMjg0LjMyIDI1Ny4xIi8+PHBvbHlnb24gY2xhc3M9ImciIHBvaW50cz0iMjk0LjY2IDMxNC41NCAyODEuMzQgMzgyLjMxIDI5MC44OCAzODguODcgMzQ4LjkyIDM0My41NSAzNTAuOTEgMjk4LjA0IDI5NC42NiAzMTQuNTQiLz48cG9seWdvbiBjbGFzcz0iZyIgcG9pbnRzPSIxNTcuMTIgMjk4LjA0IDE1OC43MSAzNDMuNTUgMjE2Ljc1IDM4OC44NyAyMjYuMjkgMzgyLjMxIDIxMy4xNyAzMTQuNTQgMTU3LjEyIDI5OC4wNCIvPjxwb2x5Z29uIGNsYXNzPSJoIiBwb2ludHM9IjI5NS42NSA0NTEuMjggMjk2LjI1IDQzMi44IDI5MS4yOCA0MjguNDIgMjE2LjM1IDQyOC40MiAyMTEuNzggNDMyLjggMjEyLjE4IDQ1MS4yOCAxNDkuNTcgNDIxLjY3IDE3MS40MyA0MzkuNTUgMjE1Ljc1IDQ3MC4zNiAyOTEuODggNDcwLjM2IDMzNi40IDQzOS41NSAzNTguMjYgNDIxLjY3IDI5NS42NSA0NTEuMjgiLz48cG9seWdvbiBjbGFzcz0iaSIgcG9pbnRzPSIyOTAuODggMzg4Ljg3IDI4MS4zNCAzODIuMzEgMjI2LjI5IDM4Mi4zMSAyMTYuNzUgMzg4Ljg3IDIxMS43OCA0MzIuOCAyMTYuMzUgNDI4LjQyIDI5MS4yOCA0MjguNDIgMjk2LjI1IDQzMi44IDI5MC44OCAzODguODciLz48cG9seWdvbiBjbGFzcz0iaiIgcG9pbnRzPSI0OTAuNDQgMTU2LjkyIDUwNy4zMyA3NS44MyA0ODIuMDkgMC41IDI5MC44OCAxNDIuNDEgMzY0LjQyIDIwNC42MiA0NjguMzcgMjM1LjAzIDQ5MS40MyAyMDguMiA0ODEuNDkgMjAxLjA1IDQ5Ny4zOSAxODYuNTQgNDg1LjA3IDE3NyA1MDAuOTcgMTY0Ljg3IDQ5MC40NCAxNTYuOTIiLz48cG9seWdvbiBjbGFzcz0iaiIgcG9pbnRzPSIwLjUgNzUuODMgMTcuMzkgMTU2LjkyIDYuNjYgMTY0Ljg3IDIyLjU2IDE3NyAxMC40NCAxODYuNTQgMjYuMzQgMjAxLjA1IDE2LjQgMjA4LjIgMzkuMjYgMjM1LjAzIDE0My4yMSAyMDQuNjIgMjE2Ljc1IDE0Mi40MSAyNS41NCAwLjUgMC41IDc1LjgzIi8+PHBvbHlnb24gY2xhc3M9ImciIHBvaW50cz0iNDY4LjM3IDIzNS4wMyAzNjQuNDIgMjA0LjYyIDM5Ni4wMyAyNTIuMTMgMzQ4LjkyIDM0My41NSA0MTAuOTMgMzQyLjc2IDUwMy4zNiAzNDIuNzYgNDY4LjM3IDIzNS4wMyIvPjxwb2x5Z29uIGNsYXNzPSJnIiBwb2ludHM9IjE0My4yMSAyMDQuNjIgMzkuMjYgMjM1LjAzIDQuNjcgMzQyLjc2IDk2LjkgMzQyLjc2IDE1OC43MSAzNDMuNTUgMTExLjggMjUyLjEzIDE0My4yMSAyMDQuNjIiLz48cG9seWdvbiBjbGFzcz0iZyIgcG9pbnRzPSIyODQuMzIgMjU3LjEgMjkwLjg4IDE0Mi40MSAzMjEuMSA2MC43MiAxODYuOTMgNjAuNzIgMjE2Ljc1IDE0Mi40MSAyMjMuNyAyNTcuMSAyMjYuMDkgMjkzLjI3IDIyNi4yOSAzODIuMzEgMjgxLjM0IDM4Mi4zMSAyODEuNzQgMjkzLjI3IDI4NC4zMiAyNTcuMSIvPjwvc3ZnPg==',
  Ecko: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAxMiAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTk0ODcgMTUuNjA5Mkw4LjA1Nzk1IDE0LjYzOTRMNS45OTAwNCAxMi41MDAzTDguMDU3OTUgMTAuMzYwOEw4Ljk5NDg3IDkuMzkxODNMOS45MzIwNyAxMC4zNjA4TDEyIDEyLjUwMDNMOS45MzIwNyAxNC42Mzk0TDguOTk0ODcgMTUuNjA5MlpNOC45OTQ4NyAxOC42MDcxVjI1TDAgMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyAxOC42MDcxWk0wIDkuMzA0OTdWMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyA2LjM5NDE3VjBMMCA5LjMwNDk3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIwNTFfMTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjA1MV8xNiIgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRkQzMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkYwMEI4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  WalletConnect:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjEuNDM4NTQsOTQuMDAzOGM0OC45MTEyMywtNDcuODg4MTcgMTI4LjIxMTk5LC00Ny44ODgxNyAxNzcuMTIzMjEsMGw1Ljg4NjU1LDUuNzYzNDJjMi40NDU1NiwyLjM5NDQxIDIuNDQ1NTYsNi4yNzY1MSAwLDguNjcwOTJsLTIwLjEzNjcsMTkuNzE1NWMtMS4yMjI3OCwxLjE5NzIxIC0zLjIwNTMsMS4xOTcyMSAtNC40MjgwOCwwbC04LjEwMDU4LC03LjkzMTE1Yy0zNC4xMjE2OSwtMzMuNDA3OTggLTg5LjQ0Mzg5LC0zMy40MDc5OCAtMTIzLjU2NTU4LDBsLTguNjc1MDYsOC40OTM2MWMtMS4yMjI3OCwxLjE5NzIgLTMuMjA1MywxLjE5NzIgLTQuNDI4MDgsMGwtMjAuMTM2NjksLTE5LjcxNTVjLTIuNDQ1NTYsLTIuMzk0NDEgLTIuNDQ1NTYsLTYuMjc2NTIgMCwtOC42NzA5Mmw2LjQ2MTAxLC02LjMyNTg4em0yMTguNzY3OCw0MC43NzM3NWwxNy45MjE3LDE3LjU0Njg5YzIuNDQ1NTQsMi4zOTQ0IDIuNDQ1NTYsNi4yNzY0OCAwLjAwMDAzLDguNjcwODlsLTgwLjgxMDE3LDc5LjEyMTE0Yy0yLjQ0NTU1LDIuMzk0NDIgLTYuNDEwNTksMi4zOTQ0NSAtOC44NTYxNiwwLjAwMDA2Yy0wLjAwMDAxLC0wLjAwMDAxIC0wLjAwMDAzLC0wLjAwMDAyIC0wLjAwMDA0LC0wLjAwMDAzbC01Ny4zNTQxNCwtNTYuMTU0NThjLTAuNjExMzksLTAuNTk4NiAtMS42MDI2NSwtMC41OTg2IC0yLjIxNDA0LDBjMCwwLjAwMDAxIC0wLjAwMDAxLDAuMDAwMDEgLTAuMDAwMDEsMC4wMDAwMmwtNTcuMzUyOTIsNTYuMTU0NTNjLTIuNDQ1NTQsMi4zOTQ0MyAtNi40MTA1OCwyLjM5NDQ3IC04Ljg1NjE2LDAuMDAwMDhjLTAuMDAwMDIsLTAuMDAwMDEgLTAuMDAwMDMsLTAuMDAwMDIgLTAuMDAwMDUsLTAuMDAwMDRsLTgwLjgxMjQyLC03OS4xMjIxOWMtMi40NDU1NiwtMi4zOTQ0IC0yLjQ0NTU2LC02LjI3NjUxIDAsLTguNjcwOTFsMTcuOTIxNzMsLTE3LjU0Njg3YzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMGw1Ny4zNTQ5OCw1Ni4xNTUzNWMwLjYxMTM5LDAuNTk4NjEgMS42MDI2NSwwLjU5ODYxIDIuMjE0MDQsMGMwLjAwMDAxLDAgMC4wMDAwMiwtMC4wMDAwMSAwLjAwMDAzLC0wLjAwMDAybDU3LjM1MjEsLTU2LjE1NTMzYzIuNDQ1NSwtMi4zOTQ0NyA2LjQxMDU0LC0yLjM5NDU2IDguODU2MTYsLTAuMDAwMmMwLjAwMDAzLDAuMDAwMDMgMC4wMDAwNywwLjAwMDA3IDAuMDAwMSwwLjAwMDFsNTcuMzU0OSw1Ni4xNTU0M2MwLjYxMTM5LDAuNTk4NiAxLjYwMjY1LDAuNTk4NiAyLjIxNDA0LDBsNTcuMzUzOTgsLTU2LjE1NDMyYzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMHoiIGZpbGw9IiMzYjk5ZmMiIGlkPSJzdmdfMSIvPjwvc3ZnPg==',
}
export const ADAPTER_INSTALL_URLS = {
  Ecko: 'https://wallet.ecko.finance/',
}

export const KadenaWalletProvider = ({
  children,
}: KadenaWalletProviderProps) => {
  const { client } = useKadenaWallet()
  const [currentWallet, setCurrentWallet] = useState<string | null>(null)
  const [activeAccount, setActiveAccount] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastWallet, setLastWallet] = useLocalStorage<string | null>(
    'sushi.kadena.wallet',
    null,
  )
  const [hasAttemptedAutoConnect, setHasAttemptedAutoConnect] = useState(false)

  const handleConnect = useCallback(
    async (walletAdapterName: string) => {
      if (!walletAdapterName) return
      if (walletAdapterName !== 'WalletConnect') {
        setIsConnecting(true)
      }
      try {
        const accountInfo = await client.connect(walletAdapterName)
        setLastWallet(walletAdapterName)
        setActiveAccount(accountInfo)
        setCurrentWallet(walletAdapterName)
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    },
    [setLastWallet, client],
  )

  const handleDisconnect = useCallback(async () => {
    if (currentWallet) {
      await client.disconnect(currentWallet)
      setLastWallet(null)
      setActiveAccount(null)
      setCurrentWallet(null)
      setIsConnected(false)
    }
  }, [client, currentWallet, setLastWallet])

  //autoconnect start
  const activeAdapters = client.getDetectedAdapters()
  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (
          lastWallet &&
          activeAdapters.find((adapter) => adapter.name === lastWallet) &&
          !hasAttemptedAutoConnect
        ) {
          setHasAttemptedAutoConnect(true)
          await handleConnect(lastWallet)
        }
      } catch (error) {
        console.log('Auto connect failed', error)
      }
    }
    connectWallet()
  }, [activeAdapters, lastWallet, hasAttemptedAutoConnect, handleConnect])
  //autoconnect end

  const walletAdapters = client.getProviders().map((adapter) => ({
    name: adapter.name,
    detected: adapter.detected,
    imageURI:
      KADENA_WALLET_ADAPTER_ICONS[
        adapter.name as keyof typeof KADENA_WALLET_ADAPTER_ICONS
      ] || '',
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
