'use client'

import { Button, Chip, Loader, Slot } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { DEFAULT_CHAIN_ID_BY_NAMESPACE } from 'src/lib/wallet'
import { useWalletState } from 'src/lib/wallet/provider/wallet-state-provider'
import { getChainById } from 'sushi'
import ConnectEvmWalletButton from './connect-evm-wallet-button'
import ConnectSvmWalletButton from './connect-svm-wallet-button'
import type { ConnectWalletButtonProps } from './types'

function ConnectButton(props: ConnectWalletButtonProps) {
  if (!props.wallet.isAvailable || props.onClick) {
    const { asChild, wallet, onClick, children } = props

    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        onClick={
          !props.wallet.isAvailable
            ? () => {
                if (wallet.url) {
                  window.open(wallet.url, '_blank', 'noopener,noreferrer')
                }
              }
            : onClick
        }
      >
        {children}
      </Comp>
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
  variant = 'wallet',
  ...props
}: Omit<ConnectWalletButtonProps, 'asChild' | 'children'> & {
  variant?: 'wallet' | 'namespace'
}) {
  const { wallet } = props
  const rightChip = props.wallet.isRecent
    ? 'Recent'
    : props.wallet.isInstalled
      ? 'Installed'
      : undefined

  const { setPendingWalletId, pendingWalletId } = useWalletState()

  const isPending = pendingWalletId === wallet.id

  return (
    <ConnectButton
      asChild
      {...props}
      onMutate={() => {
        setPendingWalletId(wallet.id)
        props.onMutate?.()
      }}
      onSettled={() => {
        setPendingWalletId(undefined)
        props.onSettled?.()
      }}
    >
      <Button
        fullWidth
        size="lg"
        variant="ghost"
        className="!justify-between gap-3 !rounded-none"
        pending={isPending.toString()}
        disabled={Boolean(pendingWalletId)}
      >
        <div className="flex flex-1 justify-between gap-3">
          {variant === 'namespace' ? (
            <div className="flex gap-3">
              <NetworkIcon
                chainId={DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace]}
                className="h-6 w-6 shrink-0"
              />
              <span>
                {
                  getChainById(DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace])
                    .name
                }
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
        ) : rightChip && variant === 'wallet' ? (
          <Chip variant="secondary">{rightChip}</Chip>
        ) : null}
      </Button>
    </ConnectButton>
  )
}
