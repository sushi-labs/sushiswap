'use client'

import { Button, Chip, Loader } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { useWalletState } from 'src/lib/wallet/provider/wallet-state-provider'
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
    const { wallet, onMutate, onSettled, onSuccess, maxWidth, ...rest } = props
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
  onSuccess,
}: Pick<ConnectWalletButtonProps, 'wallet' | 'onSuccess'>) {
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
      className="!justify-between gap-3"
      pending={isPending.toString()}
      disabled={Boolean(pendingWalletId)}
      onMutate={() => setPendingWalletId(wallet.id)}
      onSuccess={(address) => {
        onSuccess?.(address)
      }}
      onSettled={() => setPendingWalletId(undefined)}
    >
      <div className="flex flex-1 justify-between gap-3">
        <div className="flex gap-3">
          <img
            src={wallet.icon}
            alt={wallet.name}
            className="h-6 w-6 shrink-0"
          />
          <span>{wallet.name}</span>
        </div>
      </div>
      {isPending ? (
        <Loader />
      ) : rightChip ? (
        <Chip variant="secondary">{rightChip}</Chip>
      ) : null}
    </ConnectButton>
  )
}
