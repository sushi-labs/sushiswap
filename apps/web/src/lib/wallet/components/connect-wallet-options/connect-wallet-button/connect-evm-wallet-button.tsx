'use client'

import { Button } from '@sushiswap/ui'
import { useEvmWalletContext } from 'src/lib/wallet/namespaces/evm/provider/evm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectEvmWalletButton({
  wallet,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { connect } = useEvmWalletContext()

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
