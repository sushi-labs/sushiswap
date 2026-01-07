'use client'

import { Button } from '@sushiswap/ui'
import { useSvmWalletContext } from 'src/lib/wallet/namespaces/svm/provider/svm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectSvmWalletButton({
  wallet,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { connect } = useSvmWalletContext()

  return (
    <Button
      {...buttonProps}
      onClick={async () => {
        onMutate?.()
        try {
          await connect(wallet, onSuccess)
        } catch (error) {
          onError?.(error as Error)
        } finally {
          onSettled?.()
        }
      }}
    />
  )
}
