'use client'

import { useMemo } from 'react'
import type { WalletNamespace, WalletWithState } from '../../types'
import { ConnectWalletButton } from '../connect-wallet-button'
import { useWalletsList } from './use-wallets-list'

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
        <ConnectWalletButton
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

function WalletConnectorsList({
  namespace,
  onConnect,
  onSelectMultiNamespaceWallet,
}: WalletConnectorsListProps) {
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

    const byName = new Map<string, WalletWithState[]>()

    for (const wallet of sortedWallets) {
      const key = wallet.name.toLowerCase()
      byName.set(key, [...(byName.get(key) ?? []), wallet])
    }

    return Array.from(byName.values()).map((wallets) =>
      wallets.length === 1
        ? { type: 'single', wallet: wallets[0] }
        : { type: 'multi', wallets: wallets },
    )
  }, [wallets, namespace])

  return (
    <div>
      {options.map((option) =>
        option.type === 'multi' ? (
          <ConnectWalletButton
            key={option.wallets[0].id}
            wallet={option.wallets[0]}
            onClick={() => onSelectMultiNamespaceWallet?.(option.wallets)}
          />
        ) : (
          <ConnectWalletButton
            key={option.wallet.id}
            wallet={option.wallet}
            onSuccess={onConnect}
          />
        ),
      )}
    </div>
  )
}
