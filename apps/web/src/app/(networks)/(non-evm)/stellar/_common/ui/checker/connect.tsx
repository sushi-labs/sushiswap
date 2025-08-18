'use client'

import type { ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'

import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { useStellarWallet } from '~stellar/providers'

const Connect: FC<ButtonProps> = ({ children, ...props }) => {
  const { connectedAddress } = useStellarWallet()

  if (!connectedAddress) return <ConnectWalletButton {...props} />

  return <>{children}</>
}

export { Connect }
