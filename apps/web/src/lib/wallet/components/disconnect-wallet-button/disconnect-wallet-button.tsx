import dynamic from 'next/dynamic'
import type { DisconnectWalletButtonProps } from './types'

const DisconnectEvmWalletButton = dynamic(
  () => import('./disconnect-evm-wallet-button'),
  { ssr: false },
)

const DisconnectSvmWalletButton = dynamic(
  () => import('./disconnect-svm-wallet-button'),
  { ssr: false },
)

export function DisconnectWalletButton(props: DisconnectWalletButtonProps) {
  switch (props.namespace) {
    case 'svm':
      return <DisconnectSvmWalletButton {...props} />
    case 'evm':
      return <DisconnectEvmWalletButton {...props} />
    default:
      return null
  }
}
