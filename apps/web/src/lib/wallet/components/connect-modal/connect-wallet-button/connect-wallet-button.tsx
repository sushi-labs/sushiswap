'use client'

import { Button, Chip } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import type { WalletWithState } from 'src/lib/wallet/types'
import type { ConnectWalletButtonProps } from './types'

const ConnectEvmWalletButton = dynamic(
  () => import('./connect-evm-wallet-button'),
  { ssr: false },
)

const ConnectSvmWalletButton = dynamic(
  () => import('./connect-svm-wallet-button'),
  { ssr: false },
)

function ConnectNamespaceButton(props: ConnectWalletButtonProps) {
  if (!props.wallet.available) {
    const { wallet, ...rest } = props
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

interface Props {
  wallet: WalletWithState
}

export function ConnectWalletButton({ wallet }: Props) {
  const rightChip = wallet.available
    ? 'Connect'
    : wallet.url
      ? 'Get wallet'
      : 'Unavailable'

  return (
    <ConnectNamespaceButton
      wallet={wallet}
      fullWidth
      size="lg"
      variant="ghost"
      className="!justify-between gap-3"
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
      <Chip variant="secondary">{rightChip}</Chip>
    </ConnectNamespaceButton>
  )
}
