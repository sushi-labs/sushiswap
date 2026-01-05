'use client'

import { Button } from '@sushiswap/ui'
import { useEvmWalletContext } from 'src/lib/wallet/namespaces/evm/provider/evm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectEvmWalletButton({
  wallet,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { connect } = useEvmWalletContext()

  return (
    <Button
      {...buttonProps}
      //   disabled={buttonProps.disabled || pendingWalletId === wallet.id} todo
      onClick={async () => {
        await connect(wallet)
      }}
    />
  )
}
