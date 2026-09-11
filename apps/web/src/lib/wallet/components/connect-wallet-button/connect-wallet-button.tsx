import { Slot } from '@sushiswap/ui'
import {
  type ReactNode,
  Suspense,
  cloneElement,
  isValidElement,
  lazy,
} from 'react'
import type { ConnectWalletButtonProps } from './types'

const ConnectEvmButton = lazy(() => import('./connect-evm-wallet-button'))
const ConnectSvmButton = lazy(() => import('./connect-svm-wallet-button'))
const ConnectStellarButton = lazy(
  () => import('./connect-stellar-wallet-button'),
)

function getLoadingFallback(children: ReactNode): ReactNode {
  if (!isValidElement<{ disabled?: boolean }>(children)) return children
  return cloneElement(children, { disabled: true })
}

export function ConnectWalletButton(props: ConnectWalletButtonProps) {
  if (!props.wallet.isAvailable || props.onClick) {
    const { asChild, wallet, onClick, children } = props

    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        onClick={
          !wallet.isAvailable
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

  const namespace = props.wallet.namespace

  return (
    <Suspense fallback={getLoadingFallback(props.children)}>
      {namespace === 'evm' ? (
        <ConnectEvmButton {...props} />
      ) : namespace === 'svm' ? (
        <ConnectSvmButton {...props} />
      ) : namespace === 'stellar' ? (
        <ConnectStellarButton {...props} />
      ) : null}
    </Suspense>
  )
}
