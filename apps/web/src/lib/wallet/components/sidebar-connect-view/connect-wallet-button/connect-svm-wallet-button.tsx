'use client'

import { Button } from '@sushiswap/ui'
import { useSvmWalletContext } from 'src/lib/wallet/namespaces/svm/provider/svm-wallet-provider'
import type { ConnectWalletButtonProps } from './types'

export default function ConnectSvmWalletButton({
  wallet,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { connect } = useSvmWalletContext()

  return (
    <Button
      {...buttonProps}
      //   disabled={buttonProps.disabled || pendingWalletId === wallet.id} // TODO
      onClick={async () => {
        await connect(wallet)
      }}
    />
  )
}
