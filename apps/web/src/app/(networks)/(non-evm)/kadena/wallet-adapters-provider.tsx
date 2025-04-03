// WalletAdaptersContext.tsx
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { kadenaNamespace } from '~kadena/_common/constants/wallet-connect'
import type { EckoWalletConnectSuccess } from '~kadena/_common/ui/WalletConnector/types'
import { useWalletConnectContext } from '~kadena/wallet-connect-provider'
import { useWalletDispatch } from '~kadena/wallet-provider'

type AdapterName = 'eckoWALLET' | 'WalletConnect'

export type WalletAdapter = {
  name: AdapterName
  icon: string
  readyState: 'Found' | 'NotDetected'
  onClick: () => void
}

type WalletAdaptersContextType = {
  adapters: WalletAdapter[]
  activeAdapter: AdapterName | null
  connect: (adapter: AdapterName) => Promise<void>
  disconnect: () => Promise<void>
}

const WalletAdaptersContext = createContext<
  WalletAdaptersContextType | undefined
>(undefined)

export const WalletAdaptersProvider = ({
  children,
}: { children: ReactNode }) => {
  const { setConnecting, connect: setConnectedAccount } = useWalletDispatch()
  const { provider, modal } = useWalletConnectContext()
  const [adapter, setAdapter] = useState<AdapterName | null>(null)

  const isEckoWalletInstalled = useMemo(() => {
    const { kadena } = window as any
    return Boolean(kadena?.isKadena)
  }, [])

  const connect = useCallback(
    async (selectedAdapter: AdapterName) => {
      setAdapter(selectedAdapter)

      if (selectedAdapter === 'eckoWALLET') {
        const kadena = (window as any).kadena
        const res: EckoWalletConnectSuccess = await kadena.request({
          method: 'kda_connect',
          networkId: 'mainnet01',
        })
        setConnectedAccount(res.account.account)
      }

      if (selectedAdapter === 'WalletConnect') {
        const session = await provider?.connect({ namespaces: kadenaNamespace })

        const accountPrefix = 'kadena:mainnet01:'
        const account =
          session?.namespaces.kadena.accounts[0].split(accountPrefix)[1]
        setConnectedAccount(`k:${account as string}`)
      }

      modal?.closeModal()
    },
    [provider, modal, setConnectedAccount],
  )

  const disconnect = useCallback(async () => {
    if (adapter === 'WalletConnect') {
      await provider?.disconnect()
    }

    if (adapter === 'eckoWALLET') {
      const kadena = (window as any).kadena
      await kadena.request({ method: 'kda_disconnect', networkId: 'mainnet01' })
    }

    setAdapter(null)
    setConnectedAccount('')
  }, [adapter, provider, setConnectedAccount])

  const adapters: WalletAdapter[] = useMemo(
    () => [
      {
        name: 'eckoWALLET',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAxMiAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTk0ODcgMTUuNjA5Mkw4LjA1Nzk1IDE0LjYzOTRMNS45OTAwNCAxMi41MDAzTDguMDU3OTUgMTAuMzYwOEw4Ljk5NDg3IDkuMzkxODNMOS45MzIwNyAxMC4zNjA4TDEyIDEyLjUwMDNMOS45MzIwNyAxNC42Mzk0TDguOTk0ODcgMTUuNjA5MlpNOC45OTQ4NyAxOC42MDcxVjI1TDAgMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyAxOC42MDcxWk0wIDkuMzA0OTdWMTUuNjk1M0wzLjA5MDg3IDEyLjQ5OTVMOC45OTQ4NyA2LjM5NDE3VjBMMCA5LjMwNDk3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIwNTFfMTYpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjA1MV8xNiIgeDE9IjYiIHkxPSIwIiB4Mj0iNiIgeTI9IjI1IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRkQzMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkYwMEI4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
        readyState: isEckoWalletInstalled ? 'Found' : 'NotDetected',
        onClick: async () => {
          setConnecting(true)
          try {
            await connect('eckoWALLET')
          } catch (err) {
            console.error('eckoWALLET connect error:', err)
          } finally {
            setConnecting(false)
          }
        },
      },
      {
        name: 'WalletConnect',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjEuNDM4NTQsOTQuMDAzOGM0OC45MTEyMywtNDcuODg4MTcgMTI4LjIxMTk5LC00Ny44ODgxNyAxNzcuMTIzMjEsMGw1Ljg4NjU1LDUuNzYzNDJjMi40NDU1NiwyLjM5NDQxIDIuNDQ1NTYsNi4yNzY1MSAwLDguNjcwOTJsLTIwLjEzNjcsMTkuNzE1NWMtMS4yMjI3OCwxLjE5NzIxIC0zLjIwNTMsMS4xOTcyMSAtNC40MjgwOCwwbC04LjEwMDU4LC03LjkzMTE1Yy0zNC4xMjE2OSwtMzMuNDA3OTggLTg5LjQ0Mzg5LC0zMy40MDc5OCAtMTIzLjU2NTU4LDBsLTguNjc1MDYsOC40OTM2MWMtMS4yMjI3OCwxLjE5NzIgLTMuMjA1MywxLjE5NzIgLTQuNDI4MDgsMGwtMjAuMTM2NjksLTE5LjcxNTVjLTIuNDQ1NTYsLTIuMzk0NDEgLTIuNDQ1NTYsLTYuMjc2NTIgMCwtOC42NzA5Mmw2LjQ2MTAxLC02LjMyNTg4em0yMTguNzY3OCw0MC43NzM3NWwxNy45MjE3LDE3LjU0Njg5YzIuNDQ1NTQsMi4zOTQ0IDIuNDQ1NTYsNi4yNzY0OCAwLjAwMDAzLDguNjcwODlsLTgwLjgxMDE3LDc5LjEyMTE0Yy0yLjQ0NTU1LDIuMzk0NDIgLTYuNDEwNTksMi4zOTQ0NSAtOC44NTYxNiwwLjAwMDA2Yy0wLjAwMDAxLC0wLjAwMDAxIC0wLjAwMDAzLC0wLjAwMDAyIC0wLjAwMDA0LC0wLjAwMDAzbC01Ny4zNTQxNCwtNTYuMTU0NThjLTAuNjExMzksLTAuNTk4NiAtMS42MDI2NSwtMC41OTg2IC0yLjIxNDA0LDBjMCwwLjAwMDAxIC0wLjAwMDAxLDAuMDAwMDEgLTAuMDAwMDEsMC4wMDAwMmwtNTcuMzUyOTIsNTYuMTU0NTNjLTIuNDQ1NTQsMi4zOTQ0MyAtNi40MTA1OCwyLjM5NDQ3IC04Ljg1NjE2LDAuMDAwMDhjLTAuMDAwMDIsLTAuMDAwMDEgLTAuMDAwMDMsLTAuMDAwMDIgLTAuMDAwMDUsLTAuMDAwMDRsLTgwLjgxMjQyLC03OS4xMjIxOWMtMi40NDU1NiwtMi4zOTQ0IC0yLjQ0NTU2LC02LjI3NjUxIDAsLTguNjcwOTFsMTcuOTIxNzMsLTE3LjU0Njg3YzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMGw1Ny4zNTQ5OCw1Ni4xNTUzNWMwLjYxMTM5LDAuNTk4NjEgMS42MDI2NSwwLjU5ODYxIDIuMjE0MDQsMGMwLjAwMDAxLDAgMC4wMDAwMiwtMC4wMDAwMSAwLjAwMDAzLC0wLjAwMDAybDU3LjM1MjEsLTU2LjE1NTMzYzIuNDQ1NSwtMi4zOTQ0NyA2LjQxMDU0LC0yLjM5NDU2IDguODU2MTYsLTAuMDAwMmMwLjAwMDAzLDAuMDAwMDMgMC4wMDAwNywwLjAwMDA3IDAuMDAwMSwwLjAwMDFsNTcuMzU0OSw1Ni4xNTU0M2MwLjYxMTM5LDAuNTk4NiAxLjYwMjY1LDAuNTk4NiAyLjIxNDA0LDBsNTcuMzUzOTgsLTU2LjE1NDMyYzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMHoiIGZpbGw9IiMzYjk5ZmMiIGlkPSJzdmdfMSIvPjwvc3ZnPg==',
        readyState: provider?.isWalletConnect ? 'Found' : 'NotDetected',
        onClick: async () => {
          setConnecting(true)
          try {
            await connect('WalletConnect')
          } catch (err) {
            console.error('WalletConnect connect error:', err)
          } finally {
            setConnecting(false)
          }
        },
      },
    ],
    [connect, provider, setConnecting, isEckoWalletInstalled],
  )

  return (
    <WalletAdaptersContext.Provider
      value={{ adapters, activeAdapter: adapter, connect, disconnect }}
    >
      {children}
    </WalletAdaptersContext.Provider>
  )
}

export const useWalletAdaptersContext = () => {
  const ctx = useContext(WalletAdaptersContext)
  if (!ctx) {
    throw new Error(
      'useWalletAdaptersContext must be used within WalletAdaptersProvider',
    )
  }
  return ctx
}
