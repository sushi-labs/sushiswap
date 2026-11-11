'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import { WalletIcon } from '@sushiswap/ui/icons/wallet-icon'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import { EvmAdapterId } from '../../namespaces/evm/config'
import { StellarAdapterId } from '../../namespaces/stellar/adapter'
import { SvmAdapterId } from '../../namespaces/svm/config'
import type { WalletNamespace, WalletWithState } from '../../types'
import { useWalletsList } from './use-wallets-list'
import { WalletConnectorsListButton } from './wallet-connectors-list-button'
import { WalletConnectorsListSkeleton } from './wallet-connectors-list-skeleton'
import { useWalletsRegistry, withWalletsRegistry } from './wallets-registry'

const MAIN_WALLET_LIMIT = 4

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
    const {
      namespace,
      onConnect,
      onSelectMultiNamespaceWallet,
      showOtherWallets,
      onShowOtherWallets,
    } = props
    return (
      <WalletConnectorsList
        namespace={namespace}
        onConnect={onConnect}
        onSelectMultiNamespaceWallet={onSelectMultiNamespaceWallet}
        showOtherWallets={showOtherWallets}
        onShowOtherWallets={onShowOtherWallets}
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
    <div className="overflow-hidden rounded-2xl divide-y-2 divide-background">
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
  showOtherWallets?: boolean
  onShowOtherWallets?: () => void
}

type WalletOption =
  | { type: 'single'; wallet: WalletWithState }
  | { type: 'multi'; wallets: WalletWithState[] }

const WalletConnectorsList = withWalletsRegistry(
  ({
    namespace,
    onConnect,
    onSelectMultiNamespaceWallet,
    showOtherWallets = false,
    onShowOtherWallets,
  }: WalletConnectorsListProps) => {
    const wallets = useWalletsList()
    const { wallets: walletsByNamespace } = useWalletsRegistry()
    const otherWalletsButtonRef = useRef<HTMLButtonElement>(null)
    const wasShowingOtherWallets = useRef(showOtherWallets)

    useEffect(() => {
      if (wasShowingOtherWallets.current && !showOtherWallets) {
        otherWalletsButtonRef.current?.focus()
      }
      wasShowingOtherWallets.current = showOtherWallets
    }, [showOtherWallets])

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

    const groups: Record<'wallet' | 'login', WalletOption[]> = {
      wallet: [],
      login: [],
    }

    for (const option of options) {
      const wallet = option.type === 'multi' ? option.wallets[0] : option.wallet
      groups[wallet.loginMethod ? 'login' : 'wallet'].push(option)
    }

    const hasOtherWallets =
      Boolean(onShowOtherWallets) && groups.wallet.length > MAIN_WALLET_LIMIT
    const visibleWallets = showOtherWallets
      ? groups.wallet.slice(MAIN_WALLET_LIMIT)
      : hasOtherWallets
        ? groups.wallet.slice(0, MAIN_WALLET_LIMIT)
        : groups.wallet

    function renderOption(option: WalletOption): ReactNode {
      return option.type === 'multi' ? (
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
      )
    }

    if (namespace === 'stellar' && !walletsByNamespace.has('stellar')) {
      return <WalletConnectorsListSkeleton />
    }

    return (
      <div className="flex flex-col gap-2">
        {visibleWallets.length > 0 ? (
          <div className="overflow-hidden rounded-2xl divide-y-2 divide-background">
            {visibleWallets.map(renderOption)}
            {hasOtherWallets && !showOtherWallets ? (
              <Button
                ref={otherWalletsButtonRef}
                fullWidth
                size="lg"
                variant="ghost"
                className="!h-auto !min-h-[72px] !justify-between gap-3 !rounded-none bg-secondary !px-4 !py-4 !text-base hover:!bg-muted focus-visible:ring-pink focus-visible:!ring-inset focus-visible:!ring-offset-0"
                onClick={onShowOtherWallets}
              >
                <span className="flex min-w-0 items-center gap-4 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink/10 text-pink ring-1 ring-accent">
                    <WalletIcon width={18} height={18} aria-hidden />
                  </span>
                  <span>Other Wallets</span>
                </span>
                <ChevronRightIcon
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Button>
            ) : null}
          </div>
        ) : null}
        {!showOtherWallets && groups.login.length > 0 ? (
          <>
            {groups.wallet.length > 0 ? (
              <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
                <div className="h-px flex-1 bg-accent" />
                <span>or</span>
                <div className="h-px flex-1 bg-accent" />
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              {groups.login.map(renderOption)}
            </div>
          </>
        ) : null}
      </div>
    )
  },
)

const isBrowserDetectedWallet = (wallet: WalletWithState) =>
  (
    [
      EvmAdapterId.Injected,
      SvmAdapterId.Standard,
      StellarAdapterId.Standard,
    ] as readonly string[]
  ).includes(wallet.adapterId)
