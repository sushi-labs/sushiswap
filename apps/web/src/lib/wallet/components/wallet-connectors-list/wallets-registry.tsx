import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ENABLED_WALLET_NAMESPACES } from '../../config'
import { useEvmWallets } from '../../namespaces/evm/provider/use-evm-wallets'
import { useSvmWallets } from '../../namespaces/svm/provider/use-svm-wallets'
import type { WalletNamespace, WalletWithState } from '../../types'

const WALLET_NAMESPACE_LISTENERS: Record<WalletNamespace, React.ComponentType> =
  {
    evm: () => {
      const wallets = useEvmWallets()
      const { setWallets } = useWalletsRegistry()

      useEffect(() => {
        setWallets('evm', wallets)
      }, [wallets, setWallets])

      return null
    },
    svm: () => {
      const wallets = useSvmWallets()
      const { setWallets } = useWalletsRegistry()

      useEffect(() => {
        setWallets('svm', wallets)
      }, [wallets, setWallets])

      return null
    },
  }

type WalletRegistryState = {
  wallets: Map<WalletNamespace, WalletWithState[]>
  setWallets(namespace: WalletNamespace, wallets: WalletWithState[]): void
}

const WalletsRegistryContext = createContext<WalletRegistryState | null>(null)

const namespaceWallets = ENABLED_WALLET_NAMESPACES.map((namespace) => {
  const Listener = WALLET_NAMESPACE_LISTENERS[namespace]
  return Listener ? { namespace, Listener } : null
}).filter(
  (x): x is { namespace: WalletNamespace; Listener: React.ComponentType } =>
    Boolean(x),
)

export function WalletsRegistryProvider({ children }: { children: ReactNode }) {
  const [wallets, setWalletsState] = useState(
    () => new Map<WalletNamespace, WalletWithState[]>(),
  )

  const setWallets = useCallback(
    (namespace: WalletNamespace, next: WalletWithState[]) => {
      setWalletsState((prev) => {
        const map = new Map(prev)
        map.set(namespace, next)
        return map
      })
    },
    [],
  )

  const value = useMemo(() => ({ wallets, setWallets }), [wallets, setWallets])

  return (
    <WalletsRegistryContext.Provider value={value}>
      {namespaceWallets.map(({ namespace, Listener }) => (
        <Listener key={namespace} />
      ))}
      {children}
    </WalletsRegistryContext.Provider>
  )
}

export function useWalletsRegistry() {
  const ctx = useContext(WalletsRegistryContext)
  if (!ctx) throw new Error('WalletRegistryProvider missing')
  return ctx
}

export function withWalletsRegistry<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function WithWalletRegistry(props: P) {
    return (
      <WalletsRegistryProvider>
        <Component {...props} />
      </WalletsRegistryProvider>
    )
  }
}
