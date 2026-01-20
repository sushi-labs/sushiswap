import { Suspense, lazy } from 'react'
import type { DisconnectWalletButtonProps } from './types'

const DisconnectEvmButton = lazy(() => import('./disconnect-evm-wallet-button'))
const DisconnectSvmButton = lazy(() => import('./disconnect-svm-wallet-button'))

export function DisconnectWalletButton(props: DisconnectWalletButtonProps) {
  const { namespace, children } = props

  return (
    <Suspense fallback={children}>
      {namespace === 'evm' ? (
        <DisconnectEvmButton {...props} />
      ) : namespace === 'svm' ? (
        <DisconnectSvmButton {...props} />
      ) : null}
    </Suspense>
  )
}
