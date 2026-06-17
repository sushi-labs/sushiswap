import { useConnectOrCreateWallet, usePrivy } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { WagmiProvider } from '@privy-io/wagmi'
import {
  connect as wagmiConnect,
  disconnect as wagmiDisconnect,
} from '@wagmi/core'
import type React from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import type { Wallet } from 'src/lib/wallet/types'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import { WagmiContext, useConnection } from 'wagmi'
import type { WalletNamespaceContext } from '../../types'
import { EvmAdapterConfig, EvmAdapterId } from '../config'
import { isEvmWallet } from '../types'

function useInEvmContext(): boolean {
  const context = useContext(WagmiContext)
  return Boolean(context)
}

const EvmWalletContext = createContext<WalletNamespaceContext | null>(null)

export function useEvmWalletContext() {
  const ctx = useContext(EvmWalletContext)
  if (!ctx)
    throw new Error(
      'useEvmWalletContext must be used within <EvmWalletProvider>',
    )
  return ctx
}

export default function EvmWalletProvider({
  children,
}: { children: React.ReactNode }) {
  const inEvmContext = useInEvmContext()

  if (inEvmContext) {
    return <_EvmWalletProvider>{children}</_EvmWalletProvider>
  } else {
    return (
      <WagmiProvider config={getWagmiConfig()}>
        <_EvmWalletProvider>{children}</_EvmWalletProvider>
      </WagmiProvider>
    )
  }
}

function _EvmWalletProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, address, connector, chainId } = useConnection()
  const { setActiveWallet } = useSetActiveWallet()
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('evm')
  const { logout } = usePrivy()

  const { connectOrCreateWallet } = useConnectOrCreateWallet({
    onSuccess: async (data) => {
      if (privyEmbeddedWallet?.address === data.wallet.address) {
        await setActiveWallet(privyEmbeddedWallet)
        return
      }
    },
  })

  const connect = useCallback(
    async (wallet: Wallet, onSuccess?: (address: string) => void) => {
      if (!isEvmWallet(wallet)) {
        throw new Error(`Invalid namespace for ${wallet.name}`)
      }
      if (wallet.adapterId === EvmAdapterId.Privy && privyEmbeddedWallet) {
        await setActiveWallet(privyEmbeddedWallet)
        onSuccess?.(privyEmbeddedWallet.address)
        return
      } else if (
        wallet.adapterId === EvmAdapterId.Privy &&
        !privyEmbeddedWallet
      ) {
        connectOrCreateWallet()
        return
      }

      if (
        connector?.id &&
        wallet.id === `evm:${connector.id.toLowerCase()}` &&
        address
      ) {
        onSuccess?.(address)
      } else {
        const { accounts } = await wagmiConnect(getWagmiConfig(), {
          connector: await EvmAdapterConfig[wallet.adapterId]({
            uid: wallet.uid,
          }),
        })
        onSuccess?.(accounts[0])
      }
    },
    [
      connector?.id,
      address,
      privyEmbeddedWallet,
      setActiveWallet,
      connectOrCreateWallet,
    ],
  )

  const disconnect = useCallback(async () => {
    await logout?.()
    await wagmiDisconnect(getWagmiConfig())
  }, [logout])

  const value = useMemo(
    () => ({
      isConnected: isConnected,
      account: address,
      connect,
      disconnect,
    }),
    [isConnected, address, connect, disconnect],
  )

  useEffect(() => {
    if (!isConnected || !connector?.id || !address || !chainId) {
      clearWalletConnections('evm')
      return
    }

    addWalletConnection({
      chainId: isEvmChainId(chainId) ? chainId : EvmChainId.ETHEREUM,
      id: `evm:${connector.id.toLowerCase()}`,
      name: connector.name,
      namespace: 'evm',
      account: address,
      icon: connector?.icon,
    })
  }, [
    isConnected,
    connector?.id,
    connector?.name,
    connector?.icon,
    address,
    chainId,
  ])

  return (
    <EvmWalletContext.Provider value={value}>
      {children}
    </EvmWalletContext.Provider>
  )
}
