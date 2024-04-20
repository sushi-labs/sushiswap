'use client'

import { ButtonProps } from '@sushiswap/ui/components/button'
import { FC } from 'react'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ConnectButton } from 'ui/common/user-profile/connect-button'

const Connect: FC<ButtonProps> = ({ children, ...props }) => {
  const { connected } = useWallet()

  if (!connected) return <ConnectButton {...props} />

  return <>{children}</>
}

export { Connect }
