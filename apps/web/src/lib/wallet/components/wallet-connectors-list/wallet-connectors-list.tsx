'use client'

import { useMemo } from 'react'
import { EvmAdapterId } from '../../namespaces/evm/config'
import { StellarAdapterId } from '../../namespaces/stellar/config'
import { SvmAdapterId } from '../../namespaces/svm/config'
import type { WalletNamespace, WalletWithState } from '../../types'
import { useWalletsList } from './use-wallets-list'
import { WalletConnectorsListButton } from './wallet-connectors-list-button'
import { useWalletsRegistry, withWalletsRegistry } from './wallets-registry'

type ConnectorsListProps =
  | (WalletConnectorsListProps & {
      variant?: 'wallet'
    })
  | (NamespaceConnectorsListProps & {
      variant: 'namespace'
    })

export default function ConnectorsList(props: ConnectorsListProps) {
  if (props.variant === 'namespace') {
    const { wallets, onConnect } = props
    return <NamespaceConnectorsList wallets={wallets} onConnect={onConnect} />
  } else {
    const { namespace, onConnect, onSelectMultiNamespaceWallet } = props
    return (
      <WalletConnectorsList
        namespace={namespace}
        onConnect={onConnect}
        onSelectMultiNamespaceWallet={onSelectMultiNamespaceWallet}
      />
    )
  }
}

type NamespaceConnectorsListProps = {
  wallets: WalletWithState[]
  onConnect?: () => void
}

function NamespaceConnectorsList({
  wallets,
  onConnect,
}: NamespaceConnectorsListProps) {
  return (
    <div>
      {wallets.map((wallet) => (
        <WalletConnectorsListButton
          key={wallet.id}
          wallet={wallet}
          onSuccess={onConnect}
          variant="namespace"
        />
      ))}
    </div>
  )
}

type WalletConnectorsListProps = {
  namespace?: WalletNamespace
  onConnect?: () => void
  onSelectMultiNamespaceWallet?: (wallets: WalletWithState[]) => void
}

type WalletOption =
  | { type: 'single'; wallet: WalletWithState }
  | { type: 'multi'; wallets: WalletWithState[] }

const WalletConnectorsList = withWalletsRegistry(
  ({
    namespace,
    onConnect,
    onSelectMultiNamespaceWallet,
  }: WalletConnectorsListProps) => {
    const wallets = useWalletsList()

    const options: WalletOption[] = useMemo(() => {
      const sortedWallets = [...wallets].sort((a, b) => {
        const priority = (wallet: WalletWithState) =>
          wallet.isRecent ? 0 : wallet.isInstalled ? 1 : 2

        return priority(a) - priority(b)
      })

      if (namespace) {
        return sortedWallets
          .filter((wallet) => wallet.namespace === namespace)
          .map((wallet) => ({ type: 'single', wallet }))
      }

      const walletsByName = new Map<
        string,
        Map<WalletNamespace, WalletWithState>
      >()

      for (const wallet of sortedWallets) {
        const key = wallet.name.toLowerCase()

        if (!walletsByName.has(key)) {
          walletsByName.set(key, new Map())
        }

        const walletsByNamespace = walletsByName.get(key)!
        const existingWallet = walletsByNamespace?.get(wallet.namespace)

        if (!existingWallet) {
          walletsByNamespace.set(wallet.namespace, wallet)
          continue
        }

        if (isBrowserDetectedWallet(wallet)) {
          continue
        }

        if (isBrowserDetectedWallet(existingWallet)) {
          walletsByNamespace.set(wallet.namespace, wallet)
        }
      }

      return Array.from(walletsByName.values()).map((walletsByNamespace) => {
        const wallets = Array.from(walletsByNamespace.values())

        return wallets.length === 1
          ? { type: 'single', wallet: wallets[0] }
          : { type: 'multi', wallets: wallets }
      })
    }, [wallets, namespace])

    return (
      <div>
        {options.map((option) =>
          option.type === 'multi' ? (
            <WalletConnectorsListButton
              key={option.wallets[0].id}
              wallet={option.wallets[0]}
              onClick={() => onSelectMultiNamespaceWallet?.(option.wallets)}
            />
          ) : (
            <WalletConnectorsListButton
              key={option.wallet.id}
              wallet={option.wallet}
              onSuccess={onConnect}
            />
          ),
        )}
      </div>
    )
  },
)

const isBrowserDetectedWallet = (wallet: WalletWithState) =>
  [
    EvmAdapterId.Injected,
    SvmAdapterId.Standard,
    StellarAdapterId.Standard,
  ].includes(wallet.adapterId)
