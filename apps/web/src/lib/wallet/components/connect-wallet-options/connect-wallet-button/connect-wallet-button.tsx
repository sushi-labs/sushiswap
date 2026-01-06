'use client'

import { Button, Chip, Loader } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import dynamic from 'next/dynamic'
import { DEFAULT_CHAIN_ID_BY_NAMESPACE } from 'src/lib/wallet'
import { useWalletState } from 'src/lib/wallet/provider/wallet-state-provider'
import { getChainById } from 'sushi'
import type { ConnectWalletButtonProps } from './types'

const ConnectEvmWalletButton = dynamic(
  () => import('./connect-evm-wallet-button'),
  { ssr: false },
)

const ConnectSvmWalletButton = dynamic(
  () => import('./connect-svm-wallet-button'),
  { ssr: false },
)

function ConnectButton(props: ConnectWalletButtonProps) {
  if (!props.wallet.isAvailable) {
    const { wallet, onMutate, onSettled, onSuccess, onError, ...rest } = props
    return (
      <Button
        onClick={() => {
          if (wallet.url) {
            window.open(wallet.url, '_blank', 'noopener,noreferrer')
          }
        }}
        {...rest}
      />
    )
  }

  if (props.onClick) {
    const { wallet, onMutate, onSettled, onSuccess, onError, ...rest } = props
    return <Button {...rest} />
  }

  switch (props.wallet.namespace) {
    case 'evm':
      return <ConnectEvmWalletButton {...props} />
    case 'svm':
      return <ConnectSvmWalletButton {...props} />
    default:
      return null
  }
}

export function ConnectWalletButton({
  wallet,
  onClick,
  onSuccess,
  showNamespace = false,
}: Pick<ConnectWalletButtonProps, 'wallet' | 'onSuccess' | 'onClick'> & {
  showNamespace?: boolean
}) {
  const rightChip = wallet.isRecent
    ? 'Recent'
    : wallet.isInstalled
      ? 'Installed'
      : undefined

  const { setPendingWalletId, pendingWalletId } = useWalletState()

  const isPending = pendingWalletId === wallet.id

  return (
    <ConnectButton
      wallet={wallet}
      fullWidth
      size="lg"
      variant="ghost"
      className="!justify-between gap-3 !rounded-none"
      pending={isPending.toString()}
      disabled={Boolean(pendingWalletId)}
      onClick={onClick}
      onMutate={() => setPendingWalletId(wallet.id)}
      onSuccess={(address) => {
        onSuccess?.(address)
      }}
      onSettled={() => setPendingWalletId(undefined)}
    >
      <div className="flex flex-1 justify-between gap-3">
        {showNamespace ? (
          <div className="flex gap-3">
            <NetworkIcon
              chainId={
                wallet.namespace === 'svm' // TODO: remove when solana is added to sushi pkg chains
                  ? 'solana'
                  : DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace]
              }
              className="h-6 w-6 shrink-0"
            />
            <span>
              {wallet.namespace === 'svm' // TODO: remove when solana is added to sushi pkg chains
                ? 'Solana'
                : getChainById(DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace])
                    .name}
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="h-6 w-6 shrink-0 rounded-md"
            />
            <span>{wallet.name}</span>
          </div>
        )}
      </div>
      {isPending ? (
        <Loader />
      ) : rightChip && !showNamespace ? (
        <Chip variant="secondary">{rightChip}</Chip>
      ) : null}
    </ConnectButton>
  )
}
