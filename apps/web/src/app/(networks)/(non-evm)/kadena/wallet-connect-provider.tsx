import { WalletConnectModal } from '@walletconnect/modal'
import UniversalProvider from '@walletconnect/universal-provider'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type WalletConnectContextType = {
  modal: WalletConnectModal | undefined
  provider: UniversalProvider | undefined
}

const WalletConnectContext = createContext<
  WalletConnectContextType | undefined
>(undefined)

export const WalletConnectProvider = ({
  children,
}: { children: ReactNode }) => {
  const [modal, setModal] = useState<WalletConnectModal | undefined>(undefined)
  const [provider, setProvider] = useState<UniversalProvider | undefined>(
    undefined,
  )

  useEffect(() => {
    const initModal = () => {
      const modalInstance = new WalletConnectModal({
        explorerRecommendedWalletIds: 'NONE',
        chains: ['kadena:mainnet01', 'kadena:testnet04'],
        projectId: 'bfcf5f3515918fd5611af917910961b2',
      })
      setModal(modalInstance)
    }

    if (!modal) {
      initModal()
    }
  }, [modal])

  useEffect(() => {
    if (!modal || provider) return

    const initProvider = async () => {
      const universalProvider = await UniversalProvider.init({
        projectId: 'bfcf5f3515918fd5611af917910961b2',
        logger: 'info',
        metadata: {
          name: 'SushiSwap',
          description: 'SushiSwap for WalletConnect',
          url: 'https://walletconnect.com/',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
      })

      universalProvider.on('display_uri', (uri: string) => {
        modal?.closeModal()
        modal?.openModal({ uri })
      })

      setProvider(universalProvider)
    }

    initProvider()
  }, [modal, provider])

  return (
    <WalletConnectContext.Provider value={{ modal, provider }}>
      {children}
    </WalletConnectContext.Provider>
  )
}

export const useWalletConnectContext = () => {
  const context = useContext(WalletConnectContext)
  if (!context) {
    throw new Error(
      'useWalletConnectContext must be used within WalletConnectProvider',
    )
  }
  return context
}
